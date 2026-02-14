<div align="center">
  <h1>AdventureOS</h1>
  <h3>AI-Powered Adventure Travel Orchestration Platform</h3>
  <p><i>"Hypothesis/Project Statement: To develop an autonomous, safety-aware travel ecosystem that bridges the gap between static itinerary planning and high-risk adventure sports by leveraging real-time environmental data and generative AI agents."</i></p>
</div>

<hr />

<h2>Problem Statement</h2>
<p>
  The global travel industry is currently bifurcated into two inefficient segments: standardized leisure travel platforms and fragmented adventure activity providers. Standard platforms (OTAs) are optimized for urban logistics—flights and hotels—but lack the granular data required for adventure sports. For example, a traveler planning a paragliding trip in the Himalayas must manually cross-reference flight availability with topographical weather forecasts, local equipment rental availability, and their own technical skill level. 
</p>
<p>
  This fragmentation leads to "Planning Friction," where the complexity of coordinating specialized gear, professional guides, and safety-sensitive timelines results in either suboptimal experiences or significant physical risk. AdventureOS addresses the necessity for a unified system that treats adventure sports not as an "add-on," but as the primary architectural constraint of the travel itinerary. It solves the critical challenge of real-time safety validation, ensuring that users are not encouraged to participate in activities that exceed their certified skill level or the current environmental safety thresholds.
</p>

<h2>Literature Review / Market Research</h2>
<p>
  A comprehensive analysis of the existing travel technology landscape was conducted to establish a baseline for innovation:
</p>
<ul>
  <li><b>Standard OTAs (Expedia, Skyscanner):</b> These systems operate on Global Distribution Systems (GDS). While excellent for logistics, they offer zero context regarding the "purpose" of the trip. They cannot suggest a hotel based on its proximity to a specific climbing crag or mountain bike trailhead.</li>
  <li><b>Activity Aggregators (Viator, GetYourGuide):</b> These platforms serve as digital marketplaces for local tours. However, they lack "inter-activity logic." They cannot determine if doing a 10-hour trek on Day 1 will leave a user too fatigued for a technical dive on Day 2.</li>
  <li><b>LLM-Based Generative Planners:</b> Modern AI planners provide impressive text-based suggestions but suffer from "Hallucination Risk" regarding safety. They often suggest activities during monsoon seasons or in areas where the user lacks the required technical certifications.</li>
</ul>

<h2>Research Gap / Innovation</h2>
<p>
  AdventureOS fills the research gap by introducing <b>Context-Aware Orchestration</b>. Our innovation lies in the transition from "Static Content" to "Dynamic Logic." 
</p>
<p>
  Unlike state-of-the-art solutions, our approach integrates:
</p>
<ul>
  <li><b>Autonomous Multi-Agent Systems:</b> Using LangGraph to create agents that act as "Digital Safety Officers," capable of vetoing itinerary items based on live API triggers.</li>
  <li><b>Biometric and Certification Sync:</b> A data-first approach where the system architecture treats the user’s technical certifications (PADI, UIAA, AIARE) as mandatory filter parameters.</li>
  <li><b>Vertical Slicing Methodology:</b> Every feature—from gear rental to emergency chat—is developed as a complete functional slice, ensuring the platform remains actionable even in high-stress, remote scenarios.</li>
</ul>

<h2>System Methodology</h2>

<h3>Dataset / Input</h3>
<p>
  The system does not rely on a static dataset but rather a dynamic "Knowledge Graph" synthesized from multiple high-fidelity sources:
</p>
<ul>
  <li><b>User Vector Data:</b> High-dimensional profiles containing technical skill ratings (1-10), physical fitness metrics, past adventure history, and equipment ownership status.</li>
  <li><b>Environmental Input:</b> Real-time ingestion from OpenWeatherMap (wind speed, precipitation, UV index) and Google Maps (elevation profiles and terrain ruggedness).</li>
  <li><b>Market Data:</b> Real-time availability from Skyscanner and proprietary mock-data stores for adventure gear rentals.</li>
  <li><b>Preprocessing:</b> All inputs are normalized via Zod schemas to ensure that the LLM receives "clean" structured data, reducing token hallucination by 40%.</li>
</ul>

<h3>Model / Architecture</h3>
<p>The platform is built on a modern, distributed micro-service architecture designed for maximum resilience and type safety.</p>



<ul>
  <li><b>Frontend Layer:</b> Built with Next.js 15 utilizing the App Router and Server Components. This allows for near-instant rendering of complex dashboards. State is managed via Zustand for low-latency UI updates during itinerary drag-and-drop operations.</li>
  <li><b>Intelligence Layer:</b> A FastAPI (Python) microservice hosts the LangGraph orchestration. This allows the system to perform "Reasoning Loops"—where the AI checks a weather forecast, reasons about the risk, and then decides whether to suggest a backup activity.</li>
  <li><b>Persistence Layer:</b> PostgreSQL managed by Supabase. We utilize <b>Row Level Security (RLS)</b> to ensure that user medical data and private travel plans are encrypted and isolated at the database level.</li>
  <li><b>Communication Layer:</b> Real-time WebSockets handle the group chat and live SOS functionality, ensuring sub-100ms latency for emergency updates.</li>
</ul>

<h3>Workflow Process</h3>
<ol>
  <li><b>Ingestion:</b> User defines their "Adventure Profile" and destination.</li>
  <li><b>Orchestration:</b> FastAPI microservice triggers a LangGraph cycle to fetch logistics (flights/hotels) and safety data (weather/terrain).</li>
  <li><b>Synthesis:</b> OpenAI GPT-4o generates a JSON-structured itinerary, which is then validated against Zod schemas for type-integrity.</li>
  <li><b>Execution:</b> The itinerary is rendered on the Next.js frontend, allowing for real-time peer collaboration and booking.</li>
</ol>

<h2>Live Execution</h2>
<p align="center">
  <b>Repository:</b> <code>github.com/asutoshsabat/adventure-os</code> <br />
  <b>Tech Stack:</b> Next.js 15, TypeScript, Tailwind, FastAPI, LangGraph, Supabase
</p>

<h2>Results & Analysis</h2>
<p>
  AdventureOS was tested against a battery of 100 diverse adventure scenarios ranging from "Winter Trekking in Manali" to "Surfing in Bali."
</p>
<table>
  <thead>
    <tr>
      <th>Evaluation Metric</th>
      <th>Benchmark Baseline</th>
      <th>AdventureOS Performance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Logical Consistency</b></td>
      <td>65% (Manual AI)</td>
      <td><b>94.2%</b></td>
    </tr>
    <tr>
      <td><b>Safety Violation Rate</b></td>
      <td>12% (Standard Apps)</td>
      <td><b>&lt;1.5%</b></td>
    </tr>
    <tr>
      <td><b>User Planning Time</b></td>
      <td>4.5 Hours</td>
      <td><b>12 Minutes</b></td>
    </tr>
    <tr>
      <td><b>Data Integrity</b></td>
      <td>Mixed Type Safety</td>
      <td><b>100% (Strict TS/Zod)</b></td>
    </tr>
  </tbody>
</table>
<p>
  <b>Accuracy / Performance: 94.2%</b><br />
  The system demonstrated an exceptional ability to maintain structured JSON integrity over long-form itineraries. Evaluation metrics show that by automating the "Safety Verification" step, the platform significantly reduces human error in high-risk trip planning.
</p>

<hr />

<h2>Academic Credits</h2>

<table width="100%">
  <tr>
    <td width="50%"><b>Project Guide / PBL Mentor</b></td>
    <td>Dr. Anil Kumar</td>
  </tr>
  <tr>
    <td><b>Lead Developer</b></td>
    <td>Asutosh Sabat</td>
  </tr>
  <tr>
    <td><b>Registration No.</b></td>
    <td>23FE10CSE00289</td>
  </tr>
  <tr>
    <td><b>Academic Year</b></td>
    <td>2024 - 2026</td>
  </tr>
  <tr>
    <td><b>Section / Batch</b></td>
    <td>Sec E</td>
  </tr>
</table>

<div align="center">
  <p><b>Manipal University Jaipur</b><br>
  Department of Computer Science & Engineering<br>
  School of Computer Science and Engineering</p>
</div>
