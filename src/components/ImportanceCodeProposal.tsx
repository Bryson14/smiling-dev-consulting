import { useState } from "react";

// NOTE: These credentials are intentionally lightweight client-side protection per
// client request. The goal is to prevent casual discovery, not provide true security.
// The proposal content is also kept out of static HTML by using client:only="react".
const CORRECT_USERNAME = "client";
const CORRECT_PASSWORD = "phase3";

function LoginDialog({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
			setError(false);
			onSuccess();
		} else {
			setError(true);
			setPassword("");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
				<div className="mb-6 text-center">
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
						<svg
							className="w-7 h-7 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h1 className="text-xl font-bold text-gray-900 dark:text-white">
						Private Document
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						Please enter your credentials to continue.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							autoComplete="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
							required
						/>
					</div>

					{error && (
						<p className="text-sm text-red-600 dark:text-red-400">
							Incorrect username or password. Please try again.
						</p>
					)}

					<button
						type="submit"
						className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						View Document
					</button>
				</form>
			</div>
		</div>
	);
}

function ProposalContent() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-8">
					<div className="flex items-start justify-between flex-wrap gap-4">
						<div>
							<p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">
								Confidential Client Proposal
							</p>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
								The Importance Code
							</h1>
							<p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
								Phase 3 — Platform Growth & Business Intelligence
							</p>
						</div>
						<div className="text-right text-sm text-gray-500 dark:text-gray-400">
							<p>Prepared by</p>
							<p className="font-semibold text-gray-700 dark:text-gray-300">
								Smiling Dev Consulting
							</p>
							<p className="mt-1">smiling.dev</p>
						</div>
					</div>

					<hr className="my-6 border-gray-200 dark:border-gray-700" />

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<p className="text-gray-500 dark:text-gray-400">Project</p>
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								The Importance Code
							</p>
						</div>
						<div>
							<p className="text-gray-500 dark:text-gray-400">Phase</p>
							<p className="font-semibold text-gray-800 dark:text-gray-200">3</p>
						</div>
						<div>
							<p className="text-gray-500 dark:text-gray-400">Type</p>
							<p className="font-semibold text-gray-800 dark:text-gray-200">
								Feature Expansion
							</p>
						</div>
						<div>
							<p className="text-gray-500 dark:text-gray-400">Status</p>
							<p className="font-semibold text-primary">Proposal</p>
						</div>
					</div>
				</div>

				{/* Executive Summary */}
				<Section title="Executive Summary" icon="📋">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
						Phase 3 of The Importance Code builds on the solid foundation
						established in Phases 1 and 2. This phase focuses on transforming
						the platform into a fully-featured business intelligence hub with
						role-based access controls, advanced analytics, and a high-conversion
						marketing funnel. The primary goals are to empower business owners
						with actionable data, lock down sensitive group information behind
						proper permission layers, and create a scalable customer acquisition
						pipeline integrated with ClickFunnels, Stripe, and major ad platforms.
					</p>
				</Section>

				{/* Feature 1: Business Dashboards */}
				<Section title="1. Enhanced Business Dashboards & Analytics" icon="📊">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						Business owners will gain access to a dedicated dashboard suite that
						surfaces the metrics that matter most. The dashboards will be
						built with real-time data updates, customizable date ranges, and
						exportable reports.
					</p>
					<FeatureList
						items={[
							"Revenue overview with month-over-month and year-over-year comparisons",
							"Active member counts, churn rates, and retention metrics",
							"Group performance summaries — engagement, activity, and growth trends",
							"Top-performing content and resource downloads",
							"Revenue attribution by acquisition channel (organic, paid, referral)",
							"Exportable CSV/PDF reports for board-level presentations",
							"Mobile-responsive dashboard so owners can check stats on the go",
						]}
					/>
				</Section>

				{/* Feature 2: Role-Based Authentication */}
				<Section title="2. Role-Based Authentication & Permissions" icon="🔐">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						The current platform needs a granular permissions layer to ensure that
						group members only see what they are entitled to see. Phase 3 will
						introduce a full Role-Based Access Control (RBAC) system.
					</p>

					<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
										Role
									</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
										Access Level
									</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
										Group Details
									</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
										Analytics
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{[
									["Platform Admin", "Full", "✅ All groups", "✅ All data"],
									[
										"Business Owner",
										"Organization-wide",
										"✅ Own org groups",
										"✅ Org data",
									],
									[
										"Group Admin",
										"Group-level",
										"✅ Own group only",
										"✅ Group data",
									],
									[
										"Group Owner",
										"Group-level",
										"✅ Own group only",
										"✅ Group data",
									],
									[
										"Group Member",
										"Member",
										"❌ Hidden details",
										"❌ No access",
									],
								].map(([role, access, groupDetails, analytics]) => (
									<tr
										key={role}
										className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
									>
										<td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
											{role}
										</td>
										<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
											{access}
										</td>
										<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
											{groupDetails}
										</td>
										<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
											{analytics}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<FeatureList
						items={[
							"Group members cannot view the list of other members in their group",
							"Group owners and admins can manage membership, view rosters, and edit group settings",
							"Invitation-based onboarding with role assignment at the point of invite",
							"Audit log of permission changes for compliance and accountability",
							"Fine-grained content visibility controls (hide specific resources from members)",
						]}
					/>
				</Section>

				{/* Feature 3: Staff Analytics */}
				<Section title="3. Staff Analytics & Data Drill-Down" icon="🔍">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						Platform administrators and business owners will be able to drill into
						individual staff performance metrics, identify coaching opportunities,
						and monitor engagement patterns across the platform.
					</p>
					<FeatureList
						items={[
							"Per-staff activity timelines — logins, content published, interactions",
							"Group facilitation scores based on member engagement and retention",
							"Leaderboards and comparison views (opt-in with staff consent settings)",
							"Drill-down from organization → group → individual for root-cause analysis",
							"Automated anomaly detection: flag unusually low/high activity periods",
							"Scheduled email digests with key staff metrics sent to owners",
							"Data export for integration with external HR or payroll systems",
						]}
					/>
				</Section>

				{/* Feature 4: ClickFunnels Integration */}
				<Section title="4. ClickFunnels Marketing Funnel Integration" icon="🚀">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						To drive new subscriber growth, Phase 3 will integrate a ClickFunnels
						high-pressure marketing funnel that captures leads and converts them
						into paying subscribers through a seamless checkout experience.
					</p>
					<FeatureList
						items={[
							"ClickFunnels landing page designed for high-conversion opt-in campaigns",
							"Lead capture forms synced directly to the platform's subscriber database",
							"Upsell and downsell flow to maximize average order value",
							"Funnel visitor tracked with UTM parameters for attribution reporting",
							"Webhook integration between ClickFunnels and the platform for instant account provisioning",
							"A/B testing support for headline, copy, and CTA variations",
						]}
					/>
				</Section>

				{/* Feature 5: Stripe Integration */}
				<Section title="5. Stripe Subscription & Payment Integration" icon="💳">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						After a prospect completes the ClickFunnels funnel, they will be
						directed to a Stripe-hosted checkout to complete their subscription.
						Once payment is confirmed, their account will be automatically
						provisioned on the platform.
					</p>
					<FeatureList
						items={[
							"Stripe Checkout for secure, PCI-compliant payment collection",
							"Subscription tiers (monthly / annual) with pro-rated upgrade/downgrade support",
							"Webhook listener to handle payment success, failure, and cancellation events",
							"Automatic account creation and role assignment upon successful payment",
							"Customer portal for subscribers to manage billing, update cards, and cancel",
							"Revenue reporting integrated into the business owner dashboard",
							"Dunning management: automated retry logic and failed payment notifications",
						]}
					/>
				</Section>

				{/* Feature 6: Pixel Tracking */}
				<Section title="6. Facebook & Google Pixel Integration" icon="📡">
					<p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
						To maximize the return on ad spend and build high-quality retargeting
						audiences, Phase 3 will set up proper pixel and conversion tracking
						across the entire funnel.
					</p>

					<div className="grid md:grid-cols-2 gap-6 mb-4">
						<div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 border border-blue-100 dark:border-blue-900">
							<h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
								<span>📘</span> Meta (Facebook) Pixel
							</h4>
							<ul className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
								{[
									"Meta Pixel installed on all funnel and platform pages",
									"Standard events: PageView, Lead, InitiateCheckout, Purchase",
									"Custom audiences: visitors, leads, subscribers, churned users",
									"Lookalike audiences built from highest-LTV subscribers",
									"Conversion API (CAPI) for server-side event deduplication",
								].map((item) => (
									<li key={item} className="flex items-start gap-2">
										<span className="text-blue-500 mt-0.5">•</span>
										{item}
									</li>
								))}
							</ul>
						</div>

						<div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-5 border border-green-100 dark:border-green-900">
							<h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
								<span>🔍</span> Google Ads & Analytics
							</h4>
							<ul className="space-y-2 text-sm text-green-900 dark:text-green-200">
								{[
									"Google Tag Manager for centralized script management",
									"GA4 with enhanced e-commerce events for subscription tracking",
									"Google Ads conversion tracking tied to Stripe purchase events",
									"Remarketing lists for Search Ads (RLSA) based on funnel stage",
									"Google Signals enabled for cross-device attribution",
								].map((item) => (
									<li key={item} className="flex items-start gap-2">
										<span className="text-green-500 mt-0.5">•</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					<FeatureList
						items={[
							"Unified event naming convention across Meta and Google for consistent reporting",
							"Data layer implementation to push events from Stripe webhooks to both pixels",
							"Quarterly pixel audit to ensure data accuracy and fix any tracking gaps",
						]}
					/>
				</Section>

				{/* Timeline */}
				<Section title="Proposed Timeline" icon="📅">
					<div className="space-y-3">
						{[
							{
								phase: "Sprint 1 (Weeks 1–3)",
								work: "RBAC system design, database schema updates, role assignment UI",
							},
							{
								phase: "Sprint 2 (Weeks 4–6)",
								work: "Business owner dashboards, analytics data pipeline setup",
							},
							{
								phase: "Sprint 3 (Weeks 7–9)",
								work: "Staff analytics drill-down, scheduled reports, anomaly detection",
							},
							{
								phase: "Sprint 4 (Weeks 10–12)",
								work: "ClickFunnels funnel build, Stripe integration, webhook handlers",
							},
							{
								phase: "Sprint 5 (Weeks 13–14)",
								work: "Meta Pixel + Google Pixel setup, GTM configuration, CAPI",
							},
							{
								phase: "Sprint 6 (Week 15)",
								work: "QA, load testing, security audit, launch prep",
							},
						].map(({ phase, work }) => (
							<div
								key={phase}
								className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
							>
								<div className="w-40 shrink-0">
									<p className="text-sm font-semibold text-primary">{phase}</p>
								</div>
								<p className="text-sm text-gray-700 dark:text-gray-300">{work}</p>
							</div>
						))}
					</div>
				</Section>

				{/* Next Steps */}
				<Section title="Next Steps" icon="✅">
					<FeatureList
						items={[
							"Review this proposal and provide feedback or questions",
							"Schedule a kick-off call to align on priorities and sprint sequencing",
							"Sign the Phase 3 Statement of Work (SOW)",
							"Provision staging environment access for development team",
							"Begin Sprint 1 discovery and technical specification",
						]}
					/>
				</Section>

				{/* Footer */}
				<div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-600">
					<p>
						This document is confidential and intended solely for the named
						client. © Smiling Dev Consulting — smiling.dev
					</p>
				</div>
			</div>
		</div>
	);
}

function Section({
	title,
	icon,
	children,
}: {
	title: string;
	icon: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 mb-6">
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
				<span className="text-2xl">{icon}</span>
				<span>{title}</span>
			</h2>
			{children}
		</div>
	);
}

function FeatureList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-2">
			{items.map((item) => (
				<li
					key={item}
					className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
				>
					<span className="text-primary mt-0.5 shrink-0">✓</span>
					{item}
				</li>
			))}
		</ul>
	);
}

export default function ImportanceCodeProposal() {
	const [authenticated, setAuthenticated] = useState(false);

	if (!authenticated) {
		return <LoginDialog onSuccess={() => setAuthenticated(true)} />;
	}

	return <ProposalContent />;
}
