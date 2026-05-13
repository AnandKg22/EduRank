# Server Architecture

## 1. Purpose
Details the specific hardware, virtual machines, serverless functions, and geographical locations where the application physically runs.

## 2. Why It Matters
Latency is the enemy of a gamified real-time system. If the database is in Frankfurt and the Vercel Edge functions are in Tokyo, the PvP battles will suffer from intolerable lag. Server architecture ensures physical proximity and resource allocation.

## 3. Example Structure
- **Infrastructure Provider**: AWS, GCP, Vercel, etc.
- **Region Configuration**: Where the servers are physically located.
- **Compute Sizing**: vCPUs, RAM, and scaling rules.

## 4. Example Content
**Infrastructure Provider**:
- *Frontend/CDN*: Vercel (Global Edge Network).
- *Backend/Database*: Supabase (Hosted on AWS).

**Region Configuration**:
- *Primary Database*: AWS `ap-south-1` (Mumbai). This minimizes latency for our primary student demographic in India.
- *Edge Functions*: Deployed globally via Deno Edge, executing closest to the user.

**Compute Sizing (Supabase)**:
- *Current Tier*: Pro.
- *Compute Size*: Small (2 vCPU, 4GB RAM).
- *Autoscaling*: Not natively enabled. DevOps must manually upgrade the compute tier during university exam weeks when traffic spikes.

## 5. AI Usage Instructions
> [!TIP]  
> When an AI evaluates a performance issue, it should cross-reference this file to understand the physical constraints. If a query is slow, it might be a region misconfiguration rather than bad SQL.

## 6. Developer Usage Instructions
- Never hardcode IP addresses. Always use environment variables for server URLs, as IP addresses will change during scaling events.

## 7. Best Practices
- **Do**: Keep the Database region as close to the primary user base as possible.
- **Don't**: Rely on a single Availability Zone for mission-critical enterprise tiers.

## 8. Maintenance Strategy
- **Owner**: Cloud Architect.
- **Update Frequency**: Annually.
- **Trigger**: Upgrading instance sizes or expanding to new global markets (requiring multi-region databases).
