import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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

	const handleNext = () => {
		if (validateStep()) {
			setStep(step + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
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

	const toggleAdditionalService = (service: string) => {
		setFormData((prev) => ({
			...prev,
			additionalServices: prev.additionalServices.includes(service)
				? prev.additionalServices.filter((s) => s !== service)
				: [...prev.additionalServices, service],
		}));
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
								className={cn(
									"w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50",
									formData.projectType === option.value
										? "border-primary bg-primary/5"
										: "border-border",
								)}
							>
								<div className="font-semibold mb-1">{option.title}</div>
								<div className="text-sm text-muted-foreground">
									{option.description}
								</div>
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
									className={cn(
										"w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50",
										formData.timeline === option.value
											? "border-primary bg-primary/5"
											: "border-border",
									)}
								>
									<div className="font-semibold mb-1">{option.title}</div>
									<div className="text-sm text-muted-foreground">
										{option.description}
									</div>
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
								className={cn(
									"w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50",
									formData.additionalServices.includes("branding")
										? "border-primary bg-primary/5"
										: "border-border",
								)}
							>
								<div className="flex items-center justify-between">
									<div>
										<div className="font-semibold mb-1">
											Branding & Design
										</div>
										<div className="text-sm text-muted-foreground">
											Logo design, color schemes, and brand guidelines
										</div>
									</div>
									{formData.additionalServices.includes("branding") && (
										<span className="text-primary text-xl">✓</span>
									)}
								</div>
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
									className={cn(
										"w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50",
										formData.userTracking === option.value
											? "border-primary bg-primary/5"
											: "border-border",
									)}
								>
									<div className="font-semibold mb-1">{option.title}</div>
									<div className="text-sm text-muted-foreground">
										{option.description}
									</div>
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
							className={cn(
								"w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary/50",
								formData.ctoServices
									? "border-primary bg-primary/5"
									: "border-border",
							)}
						>
							<div className="flex items-center justify-between">
								<div>
									<div className="font-semibold mb-1">
										Fractional CTO Services
									</div>
									<div className="text-sm text-muted-foreground">
										Ongoing technical strategy, architecture guidance, and team
										leadership
									</div>
								</div>
								{formData.ctoServices && (
									<span className="text-primary text-xl">✓</span>
								)}
							</div>
						</button>
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
							See Your Quote →
						</Button>
					</div>
				</div>
			)}

			{/* Step 5: Results */}
			{step === 5 && (() => {
				const pricing = calculatePrice();
				return (
					<div className="space-y-6 animate-fadeIn">
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
						<ul className="space-y-2">
							{formData.projectType === "static" && (
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Professional static website with modern design</span>
								</li>
							)}
							{formData.projectType === "marketing" && (
								<>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Conversion-optimized marketing site</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>SEO best practices</span>
									</li>
								</>
							)}
							{formData.projectType === "blog" && (
								<>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Modern blogging platform</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Content management system</span>
									</li>
								</>
							)}
							{formData.projectType === "crm" && (
								<>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Custom CRM solution</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Business process automation</span>
									</li>
								</>
							)}
							{formData.projectType === "full-fledged" && (
								<>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Full user authentication and management</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Database integration (Supabase or similar)</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">✓</span>
										<span>Scalable architecture</span>
									</li>
								</>
							)}
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">✓</span>
								<span>Responsive design (mobile, tablet, desktop)</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary mt-1">✓</span>
								<span>{pricing.monthlyPrice > 0 ? "Hosting, maintenance, and updates" : "Deployment assistance"}</span>
							</li>
							{formData.additionalServices.includes("branding") && (
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Brand identity and design system</span>
								</li>
							)}
							{formData.ctoServices && (
								<li className="flex items-start gap-2">
									<span className="text-primary mt-1">✓</span>
									<span>Monthly fractional CTO services</span>
								</li>
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
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								variant="outline"
								className="flex-1"
							>
								Start Over
							</Button>
						</div>
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
