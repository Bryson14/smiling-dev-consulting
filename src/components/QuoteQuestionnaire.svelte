<script lang="ts">
  import { onMount } from "svelte";
  import { cn } from "@/lib/utils";
  import Button from "./ui/Button.svelte";
  import { buttonVariants } from "./ui/button";

  interface QuestionnaireData {
    email: string;
    projectType: string;
    timeline: string;
    additionalServices: string[];
    userTracking: string;
    ctoServices: boolean;
  }

  interface PriceBreakdownItem {
    item: string;
    price: number;
    isMonthly?: boolean;
  }

  const STORAGE_KEY = "quote_questionnaire_data";

  const projectTypeOptions = [
    {
      value: "static",
      title: "Basic Website",
      description:
        "A simple, professional website to establish your online presence",
    },
    {
      value: "marketing",
      title: "Marketing Site",
      description: "Designed to attract and convert visitors into customers",
    },
    {
      value: "blog",
      title: "Blog / Content Site",
      description: "Share your expertise with a modern blogging platform",
    },
    {
      value: "crm",
      title: "Business Tools / CRM",
      description:
        "Custom tools to manage your business operations and customers",
    },
    {
      value: "full-fledged",
      title: "Full-Featured Application",
      description:
        "Complete web app with user management, authentication, and more",
    },
  ];

  const timelineOptions = [
    {
      value: "flexible",
      title: "Flexible",
      description: "3-4 months timeline",
    },
    {
      value: "standard",
      title: "Standard",
      description: "6-8 weeks timeline",
    },
    {
      value: "urgent",
      title: "Urgent",
      description: "2-4 weeks timeline (+50% rush fee)",
    },
  ];

  const userTrackingOptions = [
    {
      value: "none",
      title: "Not Needed",
      description: "Basic website without user accounts",
    },
    {
      value: "basic",
      title: "Basic Analytics",
      description: "Track visitor behavior with Google Analytics or similar",
    },
    {
      value: "advanced",
      title: "Advanced User Management",
      description: "Full authentication, user profiles, and CRM integration",
    },
  ];

  const optionClass =
    "relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  const selectedClass =
    "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20";
  const unselectedClass = "border-border";

  let step = $state(1);
  let formData = $state<QuestionnaireData>({
    email: "",
    projectType: "",
    timeline: "",
    additionalServices: [],
    userTracking: "",
    ctoServices: false,
  });
  let isSubmitting = $state(false);
  let submissionError = $state<string | null>(null);
  let hydrated = $state(false);

  const isValid = $derived.by(() => {
    switch (step) {
      case 1:
        return (
          !!formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
      case 2:
        return formData.projectType !== "";
      case 3:
        return formData.timeline !== "";
      case 4:
        return formData.userTracking !== "";
      default:
        return true;
    }
  });

  const pricing = $derived(calculatePrice());
  const breakdown = $derived(calculatePriceBreakdown());
  const oneTimeItems = $derived(breakdown.filter((item) => !item.isMonthly));
  const monthlyItems = $derived(breakdown.filter((item) => item.isMonthly));

  // Load from session storage on mount
  onMount(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        formData = { ...formData, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
    hydrated = true;
  });

  // Save to session storage on data change
  $effect(() => {
    const serialized = JSON.stringify(formData);
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, serialized);
  });

  async function handleNext() {
    if (!isValid) return;

    // If moving to step 5 (results), submit to FormSpree
    if (step === 4) {
      await submitToFormSpree();
    }

    step += 1;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitToFormSpree() {
    isSubmitting = true;
    submissionError = null;

    try {
      const quote = calculatePrice();

      // Prepare the data to send to FormSpree
      const submissionData = {
        email: formData.email,
        projectType: formData.projectType,
        timeline: formData.timeline,
        additionalServices: formData.additionalServices.join(", ") || "None",
        userTracking: formData.userTracking,
        ctoServices: formData.ctoServices ? "Yes" : "No",
        estimatedBasePrice: `$${quote.basePrice.toLocaleString()}`,
        estimatedMonthlyPrice: `$${quote.monthlyPrice.toLocaleString()}`,
      };

      const response = await fetch("https://formspree.io/f/mdkogvoy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting to FormSpree:", error);
      submissionError =
        "We encountered an issue saving your quote. Don't worry, you can still see your estimate below.";
    } finally {
      isSubmitting = false;
    }
  }

  function handleBack() {
    step -= 1;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startOver() {
    step = 1;
    submissionError = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleAdditionalService(service: string) {
    formData.additionalServices = formData.additionalServices.includes(
      service,
    )
      ? formData.additionalServices.filter((s) => s !== service)
      : [...formData.additionalServices, service];
  }

  function calculatePrice() {
    let basePrice = 0;
    let monthlyPrice = 0;

    // Base price calculation
    switch (formData.projectType) {
      case "static":
        basePrice = 2500;
        monthlyPrice = 89;
        break;
      case "marketing":
      case "blog":
        basePrice = 3000;
        monthlyPrice = 89;
        break;
      case "crm":
        basePrice = 3500;
        monthlyPrice = 89;
        break;
      case "full-fledged":
        basePrice = 5000;
        monthlyPrice = 150;
        break;
    }

    // Add for branding/style
    if (formData.additionalServices.includes("branding")) {
      basePrice += 1000;
    }

    // Add for expedited timeline
    if (formData.timeline === "urgent") {
      basePrice *= 1.5;
    }

    // Add for user tracking
    if (formData.userTracking === "advanced") {
      basePrice += 2000;
      monthlyPrice += 50;
    }

    // Add CTO services
    if (formData.ctoServices) {
      monthlyPrice += 2000;
    }

    return {
      basePrice: Math.round(basePrice),
      monthlyPrice: Math.round(monthlyPrice),
    };
  }

  function calculatePriceBreakdown() {
    const items: PriceBreakdownItem[] = [];

    // Base project price (before timeline multiplier)
    let baseProjectPrice = 0;
    let baseMonthlyPrice = 0;

    switch (formData.projectType) {
      case "static":
        baseProjectPrice = 2500;
        baseMonthlyPrice = 89;
        break;
      case "marketing":
      case "blog":
        baseProjectPrice = 3000;
        baseMonthlyPrice = 89;
        break;
      case "crm":
        baseProjectPrice = 3500;
        baseMonthlyPrice = 89;
        break;
      case "full-fledged":
        baseProjectPrice = 5000;
        baseMonthlyPrice = 150;
        break;
    }

    // Track branding separately so we can show it in the breakdown
    const brandingCost = formData.additionalServices.includes("branding")
      ? 1000
      : 0;

    // Add branding to base before urgent multiplier (matches pricing logic)
    if (brandingCost > 0) {
      baseProjectPrice += brandingCost;
    }

    // Apply urgent timeline multiplier if needed
    if (formData.timeline === "urgent") {
      baseProjectPrice *= 1.5;
    }

    // Add base items based on project type
    // Use arrays to handle multiple items and adjust last item for rounding
    const addProportionalItems = (
      proportionalItems: Array<{ label: string; proportion: number }>,
    ) => {
      let remainingPrice = baseProjectPrice;
      proportionalItems.forEach((proportionalItem, index) => {
        if (index === proportionalItems.length - 1) {
          // Last item gets the remaining amount to avoid rounding errors
          items.push({
            item: proportionalItem.label,
            price: Math.round(remainingPrice),
          });
        } else {
          const itemPrice = Math.round(
            baseProjectPrice * proportionalItem.proportion,
          );
          items.push({ item: proportionalItem.label, price: itemPrice });
          remainingPrice -= itemPrice;
        }
      });
    };

    if (formData.projectType === "static") {
      items.push({
        item: "Professional static website with modern design",
        price: Math.round(baseProjectPrice),
      });
    } else if (formData.projectType === "marketing") {
      addProportionalItems([
        { label: "Conversion-optimized marketing site", proportion: 0.7 },
        { label: "SEO best practices", proportion: 0.3 },
      ]);
    } else if (formData.projectType === "blog") {
      addProportionalItems([
        { label: "Modern blogging platform", proportion: 0.6 },
        { label: "Content management system", proportion: 0.4 },
      ]);
    } else if (formData.projectType === "crm") {
      addProportionalItems([
        { label: "Custom CRM solution", proportion: 0.65 },
        { label: "Business process automation", proportion: 0.35 },
      ]);
    } else if (formData.projectType === "full-fledged") {
      addProportionalItems([
        { label: "Full user authentication and management", proportion: 0.4 },
        {
          label: "Database integration (Supabase or similar)",
          proportion: 0.35,
        },
        { label: "Scalable architecture", proportion: 0.25 },
      ]);
    }

    // Common items
    items.push({
      item: "Responsive design (mobile, tablet, desktop)",
      price: 0,
    }); // Included in base

    // Show branding as separate item if selected (already included in the proportional items above)
    if (brandingCost > 0) {
      items.push({
        item: "Brand identity and design system (included above)",
        price: 0,
      });
    }

    // Hosting/deployment - use project-specific base monthly price
    if (formData.projectType !== "" && baseMonthlyPrice > 0) {
      items.push({
        item: "Hosting, maintenance, and updates",
        price: baseMonthlyPrice,
        isMonthly: true,
      });
    }

    // Advanced user tracking
    if (formData.userTracking === "advanced") {
      items.push({ item: "Advanced user management", price: 2000 });
      items.push({
        item: "User tracking monthly service",
        price: 50,
        isMonthly: true,
      });
    }

    // CTO services
    if (formData.ctoServices) {
      items.push({
        item: "Monthly fractional CTO services",
        price: 2000,
        isMonthly: true,
      });
    }

    return items;
  }
</script>

{#snippet checkIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
{/snippet}

<div class="max-w-3xl mx-auto">
  <!-- Progress indicator -->
  <div class="mb-8">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm text-muted-foreground">Step {step} of 5</span>
      <span class="text-sm text-muted-foreground">
        {Math.round((step / 5) * 100)}% Complete
      </span>
    </div>
    <div class="h-2 bg-muted rounded-full overflow-hidden">
      <div
        class="h-full bg-primary transition-all duration-300"
        style={`width: ${(step / 5) * 100}%`}
      ></div>
    </div>
  </div>

  <!-- Step 1: Email -->
  {#if step === 1}
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h2 class="text-3xl font-bold mb-4">Let's Get Started!</h2>
        <p class="text-lg text-muted-foreground mb-6">
          This is a quick <strong>3-minute questionnaire</strong> to help us
          understand what you need and provide you with a rough cost estimate. No
          commitment required!
        </p>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium mb-2">
          What's your email address?
        </label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          placeholder="your.email@example.com"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
        />
        <p class="text-sm text-muted-foreground mt-2">
          We'll use this to send you your personalized quote.
        </p>
      </div>

      <Button onclick={handleNext} disabled={!isValid} class="w-full" size="lg">
        Next Step →
      </Button>
    </div>
  {/if}

  <!-- Step 2: Project Type -->
  {#if step === 2}
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h2 class="text-3xl font-bold mb-4">
          What are you looking to build?
        </h2>
        <p class="text-lg text-muted-foreground mb-6">
          Tell us about the type of project you have in mind.
        </p>
      </div>

      <div class="space-y-3">
        {#each projectTypeOptions as option (option.value)}
          <button
            type="button"
            onclick={() => (formData.projectType = option.value)}
            aria-selected={formData.projectType === option.value}
            class={cn(
              optionClass,
              formData.projectType === option.value
                ? selectedClass
                : unselectedClass,
            )}
          >
            <div class="font-semibold mb-1">{option.title}</div>
            <div class="text-sm text-muted-foreground">
              {option.description}
            </div>
            {#if formData.projectType === option.value}
              <div
                class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
              >
                {@render checkIcon()}
              </div>
            {/if}
          </button>
        {/each}
      </div>

      <div class="flex gap-4">
        <Button onclick={handleBack} variant="outline" class="flex-1">
          ← Back
        </Button>
        <Button onclick={handleNext} disabled={!isValid} class="flex-1">
          Next Step →
        </Button>
      </div>
    </div>
  {/if}

  <!-- Step 3: Timeline and Additional Services -->
  {#if step === 3}
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h2 class="text-3xl font-bold mb-4">Timeline & Extras</h2>
        <p class="text-lg text-muted-foreground mb-6">
          How quickly do you need this done, and what additional services do you
          need?
        </p>
      </div>

      <div>
        <p class="block text-sm font-medium mb-3">Project Timeline</p>
        <div class="space-y-3">
          {#each timelineOptions as option (option.value)}
            <button
              type="button"
              onclick={() => (formData.timeline = option.value)}
              aria-selected={formData.timeline === option.value}
              class={cn(
                optionClass,
                formData.timeline === option.value
                  ? selectedClass
                  : unselectedClass,
              )}
            >
              <div class="font-semibold mb-1">{option.title}</div>
              <div class="text-sm text-muted-foreground">
                {option.description}
              </div>
              {#if formData.timeline === option.value}
                <div
                  class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
                >
                  {@render checkIcon()}
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <p class="block text-sm font-medium mb-3">
          Additional Services (Optional)
        </p>
        <div class="space-y-2">
          <button
            type="button"
            onclick={() => toggleAdditionalService("branding")}
            aria-selected={formData.additionalServices.includes("branding")}
            class={cn(
              optionClass,
              formData.additionalServices.includes("branding")
                ? selectedClass
                : unselectedClass,
            )}
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-8">
                <div class="font-semibold mb-1">Branding & Design</div>
                <div class="text-sm text-muted-foreground">
                  Logo design, color schemes, and brand guidelines
                </div>
              </div>
            </div>
            {#if formData.additionalServices.includes("branding")}
              <div
                class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
              >
                {@render checkIcon()}
              </div>
            {/if}
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <Button onclick={handleBack} variant="outline" class="flex-1">
          ← Back
        </Button>
        <Button onclick={handleNext} disabled={!isValid} class="flex-1">
          Next Step →
        </Button>
      </div>
    </div>
  {/if}

  <!-- Step 4: User Tracking & CTO Services -->
  {#if step === 4}
    <div class="space-y-6 animate-fadeIn">
      <div>
        <h2 class="text-3xl font-bold mb-4">Advanced Features & Support</h2>
        <p class="text-lg text-muted-foreground mb-6">
          Do you need user management or ongoing technical leadership?
        </p>
      </div>

      <div>
        <p class="block text-sm font-medium mb-3">User Tracking & Management</p>
        <div class="space-y-3">
          {#each userTrackingOptions as option (option.value)}
            <button
              type="button"
              onclick={() => (formData.userTracking = option.value)}
              aria-selected={formData.userTracking === option.value}
              class={cn(
                optionClass,
                formData.userTracking === option.value
                  ? selectedClass
                  : unselectedClass,
              )}
            >
              <div class="font-semibold mb-1">{option.title}</div>
              <div class="text-sm text-muted-foreground">
                {option.description}
              </div>
              {#if formData.userTracking === option.value}
                <div
                  class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
                >
                  {@render checkIcon()}
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <p class="block text-sm font-medium mb-3">Ongoing Technical Support</p>
        <button
          type="button"
          onclick={() => (formData.ctoServices = !formData.ctoServices)}
          aria-selected={formData.ctoServices}
          class={cn(
            optionClass,
            formData.ctoServices ? selectedClass : unselectedClass,
          )}
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 pr-8">
              <div class="font-semibold mb-1">Fractional CTO Services</div>
              <div class="text-sm text-muted-foreground">
                Ongoing technical strategy, architecture guidance, and team
                leadership
              </div>
            </div>
          </div>
          {#if formData.ctoServices}
            <div
              class="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1"
            >
              {@render checkIcon()}
            </div>
          {/if}
        </button>
      </div>

      <div class="flex gap-4">
        <Button onclick={handleBack} variant="outline" class="flex-1">
          ← Back
        </Button>
        <Button
          onclick={handleNext}
          disabled={!isValid || isSubmitting}
          class="flex-1"
        >
          {isSubmitting ? "Processing..." : "See Your Quote →"}
        </Button>
      </div>
    </div>
  {/if}

  <!-- Step 5: Results -->
  {#if step === 5}
    <div class="space-y-6 animate-fadeIn">
      {#if submissionError}
        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg p-4"
        >
          <p class="text-sm">{submissionError}</p>
        </div>
      {/if}

      <div>
        <h2 class="text-3xl font-bold mb-4">Your Custom Quote</h2>
        <p class="text-lg text-muted-foreground mb-6">
          Based on your needs, here's a rough estimate for your project:
        </p>
      </div>

      <div class="bg-primary/5 border-2 border-primary rounded-lg p-6 space-y-6">
        <div>
          <h3 class="text-sm font-medium text-muted-foreground mb-2">
            Initial Project Cost
          </h3>
          <div class="text-4xl font-bold text-primary">
            ${pricing.basePrice.toLocaleString()}
          </div>
        </div>

        {#if pricing.monthlyPrice > 0}
          <div>
            <h3 class="text-sm font-medium text-muted-foreground mb-2">
              Ongoing Monthly Services
            </h3>
            <div class="text-4xl font-bold text-primary">
              ${pricing.monthlyPrice.toLocaleString()}
              <span class="text-lg">/month</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="bg-muted/30 rounded-lg p-6">
        <h3 class="font-semibold mb-4">What's Included:</h3>
        <ul class="space-y-3">
          {#each oneTimeItems as item, index (index)}
            <li class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-2 flex-1">
                <span class="text-primary mt-1">✓</span>
                <span class="flex-1">{item.item}</span>
              </div>
              {#if item.price > 0}
                <span
                  class="font-semibold text-muted-foreground whitespace-nowrap"
                >
                  ${item.price.toLocaleString()}
                </span>
              {:else}
                <span
                  class="text-xs text-muted-foreground whitespace-nowrap italic"
                >
                  included
                </span>
              {/if}
            </li>
          {/each}
          {#if monthlyItems.length > 0}
            <li class="border-t border-muted pt-3 mt-2">
              <span class="text-sm font-medium text-muted-foreground">
                Monthly Services:
              </span>
            </li>
            {#each monthlyItems as item, index (`monthly-${index}`)}
              <li class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-2 flex-1">
                  <span class="text-primary mt-1">✓</span>
                  <span class="flex-1">{item.item}</span>
                </div>
                <span
                  class="font-semibold text-muted-foreground whitespace-nowrap"
                >
                  ${item.price.toLocaleString()}/mo
                </span>
              </li>
            {/each}
          {/if}
        </ul>
      </div>

      <div class="bg-muted/30 rounded-lg p-6">
        <h3 class="font-semibold mb-2">Next Steps</h3>
        <p class="text-muted-foreground mb-4">
          This is a rough estimate based on your selections. Let's schedule a
          call to discuss your project in detail and provide a more accurate
          quote.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="/contact"
            class={cn(buttonVariants(), "flex-1")}
            data-slot="button"
          >
            Get in Touch
          </a>
          <Button onclick={startOver} variant="outline" class="flex-1">
            Start Over
          </Button>
        </div>
      </div>

      <div class="bg-muted/20 border border-muted rounded-lg p-6">
        <h3 class="font-semibold mb-2">Important Disclaimer</h3>
        <p class="text-sm text-muted-foreground">
          All prices shown are <strong>not a commitment or contract</strong> and
          are <strong>just a rough estimate</strong> based on your answers.
          Everything is <strong>subject to change</strong> based on a detailed
          project discussion. For specific pricing and project details, please
          contact <strong>Bryson</strong> directly.
        </p>
      </div>

      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          Your email: <strong>{formData.email}</strong>
        </p>
      </div>
    </div>
  {/if}
</div>
