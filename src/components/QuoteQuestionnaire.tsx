import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface QuestionnaireData {
	email: string;
	projectType: string;
	timeline: string;
	additionalServices: string[];
	userTracking: string;
	ctoServices: boolean;
}

const STORAGE_KEY = "quote_questionnaire_data";

export default function QuoteQuestionnaire() {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<QuestionnaireData>({
		email: "",
		projectType: "",
		timeline: "",
		additionalServices: [],
		userTracking: "",
		ctoServices: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState<string | null>(null);

	// Load from session storage on mount
	useEffect(() => {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				const data = JSON.parse(saved);
				setFormData(data);
			} catch (e) {
				console.error("Failed to load saved data", e);
			}
		}
	}, []);

	// Save to session storage on data change
	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
	}, [formData]);

	const handleNext = async () => {
		if (validateStep()) {
			// If moving to step 5 (results), submit to FormSpree
			if (step === 4) {
				await submitToFormSpree();
			}
			setStep(step + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const submitToFormSpree = async () => {
		setIsSubmitting(true);
		setSubmissionError(null);

		try {
			const pricing = calculatePrice();
			
			// Prepare the data to send to FormSpree
			const submissionData = {
				email: formData.email,
				projectType: formData.projectType,
				timeline: formData.timeline,
				additionalServices: formData.additionalServices.join(", ") || "None",
				userTracking: formData.userTracking,
				ctoServices: formData.ctoServices ? "Yes" : "No",
				estimatedBasePrice: `$${pricing.basePrice.toLocaleString()}`,
				estimatedMonthlyPrice: `$${pricing.monthlyPrice.toLocaleString()}`,
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
			setSubmissionError(
				"We encountered an issue saving your quote. Don't worry, you can still see your estimate below.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBack = () => {
		setStep(step - 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const validateStep = () => {
		switch (step) {
			case 1:
				return formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
			case 2:
				return formData.projectType !== "";
			case 3:
				return formData.timeline !== "";
			case 4:
				return formData.userTracking !== "";
			default:
				return true;
		}
	};

	const calculatePrice = () => {
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

		return { basePrice: Math.round(basePrice), monthlyPrice: Math.round(monthlyPrice) };
	};

	const calculatePriceBreakdown = () => {
		const breakdown: Array<{ item: string; price: number; isMonthly?: boolean }> = [];
		
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
		const brandingCost = formData.additionalServices.includes("branding") ? 1000 : 0;
		
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
		const addProportionalItems = (items: Array<{label: string, proportion: number}>) => {
			let remainingPrice = baseProjectPrice;
			items.forEach((item, index) => {
				if (index === items.length - 1) {
					// Last item gets the remaining amount to avoid rounding errors
					breakdown.push({ item: item.label, price: Math.round(remainingPrice) });
				} else {
					const itemPrice = Math.round(baseProjectPrice * item.proportion);
					breakdown.push({ item: item.label, price: itemPrice });
					remainingPrice -= itemPrice;
				}
			});
		};
		
		if (formData.projectType === "static") {
			breakdown.push({ item: "Professional static website with modern design", price: Math.round(baseProjectPrice) });
		} else if (formData.projectType === "marketing") {
			addProportionalItems([
				{ label: "Conversion-optimized marketing site", proportion: 0.7 },
				{ label: "SEO best practices", proportion: 0.3 }
			]);
		} else if (formData.projectType === "blog") {
			addProportionalItems([
				{ label: "Modern blogging platform", proportion: 0.6 },
				{ label: "Content management system", proportion: 0.4 }
			]);
		} else if (formData.projectType === "crm") {
			addProportionalItems([
				{ label: "Custom CRM solution", proportion: 0.65 },
				{ label: "Business process automation", proportion: 0.35 }
			]);
		} else if (formData.projectType === "full-fledged") {
			addProportionalItems([
				{ label: "Full user authentication and management", proportion: 0.4 },
				{ label: "Database integration (Supabase or similar)", proportion: 0.35 },
				{ label: "Scalable architecture", proportion: 0.25 }
			]);
		}

		// Common items
		breakdown.push({ item: "Responsive design (mobile, tablet, desktop)", price: 0 }); // Included in base

		// Show branding as separate item if selected (already included in the proportional items above)
		if (brandingCost > 0) {
			breakdown.push({ item: "Brand identity and design system (included above)", price: 0 });
		}

		// Hosting/deployment - use project-specific base monthly price
		if (formData.projectType !== "" && baseMonthlyPrice > 0) {
			breakdown.push({ item: "Hosting, maintenance, and updates", price: baseMonthlyPrice, isMonthly: true });
		}

		// Advanced user tracking
		if (formData.userTracking === "advanced") {
			breakdown.push({ item: "Advanced user management", price: 2000 });
			breakdown.push({ item: "User tracking monthly service", price: 50, isMonthly: true });
		}

		// CTO services
		if (formData.ctoServices) {
			breakdown.push({ item: "Monthly fractional CTO services", price: 2000, isMonthly: true });
		}

		return breakdown;
	};

	const toggleAdditionalService = (service: string) => {
		setFormData((prev) => ({
			...prev,
			additionalServices: prev.additionalServices.includes(service)
				? prev.additionalServices.filter((s) => s !== service)
				: [...prev.additionalServices, service],
		}));
	};

	const getProjectTypeLabel = (value: string) => {
		const labels: Record<string, string> = {
			static: "Basic Website",
			marketing: "Marketing Site",
			blog: "Blog / Content Site",
			crm: "Business Tools / CRM",
			"full-fledged": "Full-Featured Application",
		};
		return labels[value] || value;
	};

	const getTimelineLabel = (value: string) => {
		const labels: Record<string, string> = {
			flexible: "Flexible (3-4 months)",
			standard: "Standard (6-8 weeks)",
			urgent: "Urgent (2-4 weeks)",
		};
		return labels[value] || value;
	};

	const getUserTrackingLabel = (value: string) => {
		const labels: Record<string, string> = {
			none: "Not Needed",
			basic: "Basic Analytics",
			advanced: "Advanced User Management",
		};
		return labels[value] || value;
	};

	return (
		<div className="max-w-3xl mx-auto">
			{/* Progress indicator */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-muted-foreground">
						Step {step} of 5
					</span>
					<span className="text-sm text-muted-foreground">
						{Math.round((step / 5) * 100)}% Complete
					</span>
				</div>
				<div className="h-2 bg-muted rounded-full overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-300"
						style={{ width: `${(step / 5) * 100}%` }}
					/>
				</div>
			</div>

			{/* Step 1: Email */}
			{step === 1 && (
				<div className="space-y-6 animate-fadeIn">
					<div>
						<h2 className="text-3xl font-bold mb-4">Let's Get Started!</h2>
						<p className="text-lg text-muted-foreground mb-6">
							This is a quick <strong>3-minute questionnaire</strong> to help us
							understand what you need and provide you with a rough cost
							estimate. No commitment required!
						</p>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium mb-2"
						>
							What's your email address?
						</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							placeholder="your.email@example.com"
							className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background"
						/>
						<p className="text-sm text-muted-foreground mt-2">
							We'll use this to send you your personalized quote.
						</p>
					</div>

					<Button
						onClick={handleNext}
						disabled={!validateStep()}
						className="w-full"
						size="lg"
					>
						Next Step →
					</Button>
				</div>
			)}

			{/* Step 2: Project Type */}
			{step === 2 && (
				<div className="space-y-6 animate-fadeIn">
					<div>
						<h2 className="text-3xl font-bold mb-4">
							What are you looking to build?
						</h2>
						<p className="text-lg text-muted-foreground mb-6">
							Tell us about the type of project you have in mind.
						</p>
					</div>

					<div className="space-y-3">
						{[
							{
								value: "static",
								title: "Basic Website",
								description:
									"A simple, professional website to establish your online presence",
							},
							{
								value: "marketing",
								title: "Marketing Site",
								description:
									"Designed to attract and convert visitors into customers",
							},
							{
								value: "blog",
								title: "Blog / Content Site",
								description:
									"Share your expertise with a modern blogging platform",
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
						].map((option) => (
							<button
								type="button"
								key={option.value}
								onClick={() =>
									setFormData({ ...formData, projectType: option.value })
								}
								aria-selected={formData.projectType === option.value}
								className={cn(
									"relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
									formData.projectType === option.value
										? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
										: "border-border",
								)}
							>
								<div className="font-semibold mb-1">{option.title}</div>
								<div className="text-sm text-muted-foreground">
									{option.description}
								</div>
								{formData.projectType === option.value && (
									<div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
										<Check className="w-4 h-4" />
									</div>
								)}
							</button>
						))}
					</div>

					<div className="flex gap-4">
						<Button onClick={handleBack} variant="outline" className="flex-1">
							← Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={!validateStep()}
							className="flex-1"
						>
							Next Step →
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Timeline and Additional Services */}
			{step === 3 && (
				<div className="space-y-6 animate-fadeIn">
					<div>
						<h2 className="text-3xl font-bold mb-4">Timeline & Extras</h2>
						<p className="text-lg text-muted-foreground mb-6">
							How quickly do you need this done, and what additional services do
							you need?
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium mb-3">
							Project Timeline
						</label>
						<div className="space-y-3">
							{[
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
							].map((option) => (
								<button
									type="button"
									key={option.value}
									onClick={() =>
										setFormData({ ...formData, timeline: option.value })
									}
									aria-selected={formData.timeline === option.value}
									className={cn(
										"relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
										formData.timeline === option.value
											? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
											: "border-border",
									)}
								>
									<div className="font-semibold mb-1">{option.title}</div>
									<div className="text-sm text-muted-foreground">
										{option.description}
									</div>
									{formData.timeline === option.value && (
										<div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
											<Check className="w-4 h-4" />
										</div>
									)}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-3">
							Additional Services (Optional)
						</label>
						<div className="space-y-2">
							<button
								type="button"
								onClick={() => toggleAdditionalService("branding")}
								aria-selected={formData.additionalServices.includes("branding")}
								className={cn(
									"relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
									formData.additionalServices.includes("branding")
										? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
										: "border-border",
								)}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1 pr-8">
										<div className="font-semibold mb-1">
											Branding & Design
										</div>
										<div className="text-sm text-muted-foreground">
											Logo design, color schemes, and brand guidelines
										</div>
									</div>
								</div>
								{formData.additionalServices.includes("branding") && (
									<div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
										<Check className="w-4 h-4" />
									</div>
								)}
							</button>
						</div>
					</div>

					<div className="flex gap-4">
						<Button onClick={handleBack} variant="outline" className="flex-1">
							← Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={!validateStep()}
							className="flex-1"
						>
							Next Step →
						</Button>
					</div>
				</div>
			)}

			{/* Step 4: User Tracking & CTO Services */}
			{step === 4 && (
				<div className="space-y-6 animate-fadeIn">
					<div>
						<h2 className="text-3xl font-bold mb-4">
							Advanced Features & Support
						</h2>
						<p className="text-lg text-muted-foreground mb-6">
							Do you need user management or ongoing technical leadership?
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium mb-3">
							User Tracking & Management
						</label>
						<div className="space-y-3">
							{[
								{
									value: "none",
									title: "Not Needed",
									description: "Basic website without user accounts",
								},
								{
									value: "basic",
									title: "Basic Analytics",
									description:
										"Track visitor behavior with Google Analytics or similar",
								},
								{
									value: "advanced",
									title: "Advanced User Management",
									description:
										"Full authentication, user profiles, and CRM integration",
								},
							].map((option) => (
								<button
									type="button"
									key={option.value}
									onClick={() =>
										setFormData({ ...formData, userTracking: option.value })
									}
									aria-selected={formData.userTracking === option.value}
									className={cn(
										"relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
										formData.userTracking === option.value
											? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
											: "border-border",
									)}
								>
									<div className="font-semibold mb-1">{option.title}</div>
									<div className="text-sm text-muted-foreground">
										{option.description}
									</div>
									{formData.userTracking === option.value && (
										<div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
											<Check className="w-4 h-4" />
										</div>
									)}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-3">
							Ongoing Technical Support
						</label>
						<button
							type="button"
							onClick={() =>
								setFormData({ ...formData, ctoServices: !formData.ctoServices })
							}
							aria-selected={formData.ctoServices}
							className={cn(
								"relative w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
								formData.ctoServices
									? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
									: "border-border",
							)}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1 pr-8">
									<div className="font-semibold mb-1">
										Fractional CTO Services
									</div>
									<div className="text-sm text-muted-foreground">
										Ongoing technical strategy, architecture guidance, and team
										leadership
									</div>
								</div>
							</div>
							{formData.ctoServices && (
								<div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1">
									<Check className="w-4 h-4" />
								</div>
							)}
						</button>
					</div>

					<div className="flex gap-4">
						<Button onClick={handleBack} variant="outline" className="flex-1">
							← Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={!validateStep() || isSubmitting}
							className="flex-1"
						>
							{isSubmitting ? "Processing..." : "See Your Quote →"}
						</Button>
					</div>
				</div>
			)}

			{/* Step 5: Results */}
			{step === 5 && (() => {
				const pricing = calculatePrice();
				const breakdown = calculatePriceBreakdown();
				const oneTimeItems = breakdown.filter(item => !item.isMonthly);
				const monthlyItems = breakdown.filter(item => item.isMonthly);
				
				return (
					<div className="space-y-6 animate-fadeIn">
						{submissionError && (
							<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg p-4">
								<p className="text-sm">{submissionError}</p>
							</div>
						)}
						
						<div>
							<h2 className="text-3xl font-bold mb-4">Your Custom Quote</h2>
							<p className="text-lg text-muted-foreground mb-6">
								Based on your needs, here's a rough estimate for your project:
							</p>
						</div>

						<div className="bg-primary/5 border-2 border-primary rounded-lg p-6 space-y-6">
							<div>
								<h3 className="text-sm font-medium text-muted-foreground mb-2">
									Initial Project Cost
								</h3>
								<div className="text-4xl font-bold text-primary">
									${pricing.basePrice.toLocaleString()}
								</div>
							</div>

							{pricing.monthlyPrice > 0 && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Ongoing Monthly Services
									</h3>
									<div className="text-4xl font-bold text-primary">
										${pricing.monthlyPrice.toLocaleString()}
										<span className="text-lg">/month</span>
									</div>
								</div>
							)}
						</div>

					<div className="bg-muted/30 rounded-lg p-6">
						<h3 className="font-semibold mb-4">What's Included:</h3>
						<ul className="space-y-3">
							{oneTimeItems.map((item, index) => (
								<li key={index} className="flex items-start justify-between gap-4">
									<div className="flex items-start gap-2 flex-1">
										<span className="text-primary mt-1">✓</span>
										<span className="flex-1">{item.item}</span>
									</div>
									{item.price > 0 && (
										<span className="font-semibold text-muted-foreground whitespace-nowrap">
											${item.price.toLocaleString()}
										</span>
									)}
									{item.price === 0 && (
										<span className="text-xs text-muted-foreground whitespace-nowrap italic">
											included
										</span>
									)}
								</li>
							))}
							{monthlyItems.length > 0 && (
								<>
									<li className="border-t border-muted pt-3 mt-2">
										<span className="text-sm font-medium text-muted-foreground">
											Monthly Services:
										</span>
									</li>
									{monthlyItems.map((item, index) => (
										<li key={`monthly-${index}`} className="flex items-start justify-between gap-4">
											<div className="flex items-start gap-2 flex-1">
												<span className="text-primary mt-1">✓</span>
												<span className="flex-1">{item.item}</span>
											</div>
											<span className="font-semibold text-muted-foreground whitespace-nowrap">
												${item.price.toLocaleString()}/mo
											</span>
										</li>
									))}
								</>
							)}
						</ul>
					</div>

					<div className="bg-muted/30 rounded-lg p-6">
						<h3 className="font-semibold mb-2">Next Steps</h3>
						<p className="text-muted-foreground mb-4">
							This is a rough estimate based on your selections. Let's schedule
							a call to discuss your project in detail and provide a more
							accurate quote.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Button asChild className="flex-1">
								<a href="/contact">Get in Touch</a>
							</Button>
							<Button
								onClick={() => {
									setStep(1);
									setIsSubmitted(false);
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								variant="outline"
								className="flex-1"
							>
								Start Over
							</Button>
						</div>
					</div>

					<div className="bg-muted/20 border border-muted rounded-lg p-6">
						<h3 className="font-semibold mb-2">Important Disclaimer</h3>
						<p className="text-sm text-muted-foreground">
							All prices shown are <strong>not a commitment or contract</strong> and are <strong>just a rough estimate</strong> based on your answers. Everything is <strong>subject to change</strong> based on a detailed project discussion. For specific pricing and project details, please contact <strong>Bryson</strong> directly.
						</p>
					</div>

					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Your email: <strong>{formData.email}</strong>
						</p>
					</div>
				</div>
			);
			})()}
		</div>
	);
}
