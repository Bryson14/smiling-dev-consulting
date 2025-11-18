---
slug: airflow-deployment-with-aws-ecs
title: Defying airflow to Amazon ECS
description: This was a big writeup of my five days of struggling to deploy
  airflow to Amazon ECS. May you not have as many difficulties as I did?
author: Bryson Meiling
pubDate: 2025-11-17
updateDate: 2025-11-17
mediumLink: https://medium.com/rustaceans/learning-about-rust-benchmarking-with-sudoku-from-5-minutes-to-17-seconds-bf166c594d3c
keywords:
  - Airflow
  - Python
  - Apache
  - ECS
image: src/content/images/IMG_0293.png
---
Strategies

\## Executive Summary

**Total Commits Analyzed:** 54

**Problem-Solving Commits:** 47 (87%)

**Documentation/Cleanup Commits:** 7 (13%)

\### Problem Distribution by Category

| Category | Count | Percentage | Top Issues |

|----------|-------|------------|------------|

| **Airflow-Specific Pitfalls** | 23 | 43% | Configuration, permissions, secrets, service communication |

| **AWS/ECS Pitfalls** | 19 | 35% | Secret injection, health checks, resource allocation, spot instances |

| **Networking Pitfalls** | 12 | 22% | IPv6, service discovery, ALB configuration, security groups |

| **CDK Pitfalls** | 8 | 15% | Context management, synthesizer, stack dependencies |

| **Docker/Container Pitfalls** | 15 | 28% | Build performance, user permissions, multi-stage builds |

_Note: Commits can appear in multiple categories_

\---

\## 1. Airflow-Specific Pitfalls (23 commits)

\### Key Learnings

\- Airflow has complex inter-service dependencies that must be carefully orchestrated

\- Secret management and encoding are critical for multi-service deployments

\- DAG deployment strategy significantly impacts architecture complexity

\- Airflow 3.x has different requirements than 2.x

\### Issues Encountered

\#### 1.1 Configuration & Environment Variables (8 commits)

**Problem:** Airflow requires precise configuration across multiple services with shared secrets.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #39 | Removed static airflow.cfg, relied on env vars | Use environment variables exclusively instead of config files |

| #40 | ECS injecting "\[object Object\]" for secrets | Fixed secret reference syntax in CDK |

| #41 | Secrets still passed incorrectly | Simplified to direct secret ARN references |

| #28 | Changed service startup based on local dev | Validated config locally first before ECS deployment |

| #4 | Major refactoring of environment variables | Centralized env var management in CDK constructs |

| #54 | Removed unneeded default env vars | Clean up reduces complexity and confusion |

| #31 | Database connection failing | Proper connection string format with all required params |

| #30 | Special characters in DB password broke startup | URL-encode passwords with special characters |

**Resolution Strategy:**

\- â Use environment variables exclusively, avoid static config files

\- â Validate configuration locally with Docker Compose before ECS

\- â URL-encode all connection strings and secrets

\- â Use CDK constructs to centralize environment variable management

\- â Reference secrets by ARN directly, not through complex wrapper objects

\#### 1.2 Database & Storage (6 commits)

**Problem:** Database connectivity and encoding issues caused repeated failures.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #30 | Encoded chars in password caused ECS failure | URL-encode passwords, avoid special chars in generation |

| #31 | DB connection failing | Security groups, connection strings, timeouts |

| #36 | Health check failed due to DB connection | Increase grace period, validate connection in startup |

| #23 | Bad IPv6 URL when connecting to Postgres | Use proper endpoint format without IPv6 |

| #22 | Switched back to PostgreSQL from alternative | Stick with well-supported databases |

| #29 | Moved DB migration to API server | Ensures DB ready before other services start |

**Resolution Strategy:**

\- â Generate passwords without special characters OR properly URL-encode them

\- â Run database migrations in the webserver/API startup, not scheduler

\- â Use RDS endpoint hostname format, avoid IPv6 references

\- â Increase health check grace periods for DB-dependent services

\- â Validate DB connectivity before starting service processes

\#### 1.3 Service Communication & Architecture (5 commits)

**Problem:** Airflow services need to communicate with each other reliably.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #46 | Worker can't reach base URL | Added service discovery and internal ALB |

| #47 | Added common JWT secret | Shared JWT for inter-service authentication |

| #27 | Can't get auth to work | Proper authentication backend configuration |

| #32 | Successfully deployed API and scheduler | Validated basic service communication |

| #24 | Split into storage/service stacks | Separate stateful from stateless resources |

**Resolution Strategy:**

\- â Use AWS Cloud Map for service discovery between components

\- â Configure internal ALB DNS for workers to reach webserver

\- â Share authentication secrets (JWT, Fernet) across all services

\- â Separate stateful (DB, cache) from stateless (compute) in stack design

\- â Deploy webserver/API first, then scheduler, then workers

\#### 1.4 DAG Deployment & Storage (7 commits)

**Problem:** Finding the right way to deploy DAGs to all Airflow services.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #15 | Tried EFS after 'aws' CLI not found in image | EFS for shared storage |

| #17 | EFS mount point issues | Fixed mount configuration |

| #18 | EFS DNS modification issues | Changed mount attachment method |

| #19 | Switched from EFS to git-sync | Git-sync sidecar pattern |

| #20 | Added git-sync with SSL certs | Proper SSL for private repos |

| #21 | Git-sync needs root permissions | Run as root to write to filesystem |

| #43 | Read-only DAG folder caused startup error | Make DAG folder writable |

| #49 | Simplified git-sync configuration | Direct git sync approach |

| #53 | Fixed git-sync repo configuration | Correct repo URL and credentials |

**Resolution Strategy:**

\- â Use git-sync sidecar pattern instead of EFS (simpler, more reliable)

\- â Run git-sync as root with proper permissions

\- â Ensure shared volume is writable by Airflow processes

\- â Mirror git-sync image to ECR with SSL certificates for private repos

\- â Configure git-sync to sync to correct path (/opt/airflow/dags)

\#### 1.5 Component Health & Scaling (6 commits)

**Problem:** Getting all Airflow components (webserver, scheduler, worker, triggerer) healthy.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #33 | Triggerer failing health checks | Temporarily disabled to isolate issues |

| #34 | Deployed without health checks | Removed to isolate startup from health check issues |

| #35 | All but worker running | Webserver, scheduler, triggerer operational |

| #44 | Re-enabled triggerer | Fixed config and re-added successfully |

| #45 | Worker killed due to high memory | Doubled memory to 2GB |

| #51 | Added worker auto-scaling | Scale 1-10 based on CPU/memory |

**Resolution Strategy:**

\- â Disable health checks initially to isolate startup issues

\- â Deploy services incrementally: webserver â scheduler â triggerer â worker

\- â Monitor memory usage and increase allocations (workers need 2GB+)

\- â Implement auto-scaling for workers (1-10 instances)

\- â Re-enable health checks after confirming services start successfully

\#### 1.6 Permissions & User Management (3 commits)

**Problem:** Container user permissions for filesystem access.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #37 | Trying to fix airflow user with root permissions | User/group permission conflicts |

| #21 | Git-sync needs root permissions to write | Run git-sync as root |

| #38 | Simplified user management in Docker | Use base image defaults |

**Resolution Strategy:**

\- â Run git-sync sidecar as root (uid 0) for file system writes

\- â Run Airflow processes as airflow user (default in base image)

\- â Use shared volumes with appropriate permissions

\- â Don't override user settings unless necessary

\---

\## 2. AWS/ECS Pitfalls (19 commits)

\### Key Learnings

\- ECS has specific requirements for secret injection and environment variables

\- Health checks need careful tuning for startup times

\- Resource allocation (CPU/memory) requires iteration based on actual usage

\- Spot instances can significantly reduce costs

\### Issues Encountered

\#### 2.1 Secret Management (5 commits)

**Problem:** ECS secret injection has specific syntax requirements.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #40 | ECS injecting "\[object Object\]" literally | Fixed CDK secret reference syntax |

| #41 | Secrets still passed incorrectly | Used direct secret ARN references |

| #47 | Added common JWT secret | Centralized secret in Secrets Manager |

| #52 | Fixed Fernet key generation | Proper secret generation in storage stack |

| #30 | Password encoding issues | URL-encode or avoid special characters |

**Resolution Strategy:**

\- â Use `ecs.Secret.fromSecretsManager(secret)` or direct ARN references

\- â Avoid complex object wrapping in secret definitions

\- â Store all secrets in Secrets Manager, not environment variables

\- â Generate secrets in storage stack, reference in service stack

\- â Use Secrets Manager rotation for production environments

\#### 2.2 Health Checks & Service Startup (8 commits)

**Problem:** ECS health checks failed due to timing and configuration issues.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #42 | ALB considering task failed, need more time | Increased grace period and check intervals |

| #36 | Health check failed due to DB connection | Added DB connection validation |

| #34 | Deployed without health checks temporarily | Isolated startup from health check issues |

| #33 | Triggerer failing health checks | Disabled until config fixed |

| #35 | Most services up without health checks | Validated core functionality first |

| #15 | Health check failed, probably DB connection | Database initialization timing |

| #12 | Added ECS circuit breaker | Automatic rollback on deployment failures |

| #54 | Removed unneeded health checks | Cleaned up redundant checks |

**Resolution Strategy:**

\- â Set health check grace period to 300-600 seconds for DB-dependent services

\- â Use circuit breaker for automatic rollback on failures

\- â Disable health checks temporarily to isolate startup issues

\- â Validate database connectivity before enabling health checks

\- â Use ALB target group health checks for webserver

\- â Configure startup scripts to wait for dependencies

\#### 2.3 Resource Allocation (5 commits)

**Problem:** Services need adequate CPU and memory resources.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #45 | Worker killed due to high memory usage | Doubled memory to 2GB |

| #42 | Bumped to 1 vCPU | Increased from 0.5 to 1 vCPU |

| #51 | Added auto-scaling for workers | Scale 1-10 based on metrics |

| #45 | Added Spot instances | Cost savings on worker fleet |

| #11 | Added temp directory configuration | Proper temp storage allocation |

**Resolution Strategy:**

\- â Start with minimum: webserver/scheduler 1 vCPU/2GB, workers 1 vCPU/2GB

\- â Monitor CloudWatch metrics for CPU/memory utilization

\- â Use Spot instances for workers (50-70% cost savings)

\- â Implement auto-scaling based on CPU (70%) and memory (80%) targets

\- â Configure temp directories with adequate storage

\#### 2.4 Container Architecture (4 commits)

**Problem:** ARM64 vs AMD64 architecture differences.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #13 | Trying ARM64 for [entrypoint.sh](http://entrypoint.sh) problem | Switched to ARM64 architecture |

| #14 | Specific ARM64 tagging | Explicit platform tagging |

| #12 | Architecture differences in ECS | Set explicit architecture in task definitions |

| #8 | Multi-stage builds with UV | Optimized for target architecture |

**Resolution Strategy:**

\- â Choose ARM64 for better price/performance (Graviton processors)

\- â Tag Docker images with explicit platform (--platform linux/arm64)

\- â Set runtimePlatform in ECS task definitions

\- â Test locally with matching architecture

\#### 2.5 Availability & Deployment (3 commits)

**Problem:** Availability zone and deployment configuration issues.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #6 | Getting error about availability zones | Added AZ mappings to context |

| #7 | Some services not starting up | Fixed ECR image references |

| #25 | Fixed subnet AZ and naming | Proper subnet selection |

**Resolution Strategy:**

\- â Cache AZ lookups in cdk.context.json to avoid API calls

\- â Use multiple AZs for high availability

\- â Ensure subnets span multiple AZs properly

\- â Use CDK context for consistent AZ selection

\---

\## 3. Networking Pitfalls (12 commits)

\### Key Learnings

\- Service-to-service communication requires proper security groups and discovery

\- ALB configuration is critical for external and internal traffic

\- IPv6 can cause unexpected connection issues

\- VPC design impacts cost and complexity

\### Issues Encountered

\#### 3.1 Service Discovery & Internal Communication (4 commits)

**Problem:** Services couldn't reliably communicate with each other.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #46 | Worker can't reach base URL | Added AWS Cloud Map service discovery |

| #46 | Worker to API connectivity | Configured internal ALB DNS |

| #46 | Security group rules missing | Added worker-to-webserver connectivity |

| #31 | DB connection failing | Security group for RDS access |

**Resolution Strategy:**

\- â Use AWS Cloud Map for service discovery (servicename.namespace)

\- â Configure internal ALB for worker-to-webserver communication

\- â Set up security groups to allow inter-service traffic

\- â Use private subnets for services, public for ALB only

\- â Document all security group rules for troubleshooting

\#### 3.2 Load Balancer Configuration (5 commits)

**Problem:** ALB health checks and routing configuration.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #42 | ALB considering task failed | Increased timeouts and grace periods |

| #2 | Initial ALB setup with webserver | Public ALB for external access |

| #46 | Added internal communication path | Internal ALB/service discovery |

| #35 | Health check configuration | Proper health check paths |

| #54 | Removed unneeded health checks | Simplified configuration |

**Resolution Strategy:**

\- â Use public ALB only for webserver/UI

\- â Set health check path to /health or /api/v1/health

\- â Configure deregistration delay to 30 seconds

\- â Set healthy/unhealthy threshold appropriately (2/3)

\- â Use longer intervals (30s) for services with slow startup

\#### 3.3 Database Connectivity (3 commits)

**Problem:** RDS connection string format and network access.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #23 | Bad IPv6 URL when connecting to Postgres | Use hostname format without brackets |

| #31 | DB connection failing | Security groups and connection params |

| #36 | DB connection in health checks | Validate connection before health checks |

**Resolution Strategy:**

\- â Use RDS endpoint hostname directly: `dbinstance.xxxxxx.region.rds.amazonaws.com`

\- â Avoid IPv6 format with brackets: `[::1]`

\- â Configure security group ingress on port 5432 from ECS tasks

\- â Use private subnets for RDS (never public)

\- â Test connection string format locally first

\#### 3.4 VPC & Subnet Configuration (3 commits)

**Problem:** Subnet and availability zone configuration.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #6 | AZ errors | Fixed AZ configuration and context |

| #25 | Subnet AZ issues | Proper subnet selection in correct AZs |

| #24 | VPC in storage stack | Centralized VPC in stateful stack |

**Resolution Strategy:**

\- â Create VPC in storage/stateful stack

\- â Use 2-3 AZs for high availability

\- â Separate public and private subnets

\- â Use NAT gateway for private subnet internet access

\- â Cache AZ lookups in cdk.context.json

\---

\## 4. CDK Pitfalls (8 commits)

\### Key Learnings

\- Stack organization impacts maintainability and deployment

\- Context management is crucial for consistent deployments

\- CDK warnings should be addressed early

\- Stack dependencies must be explicitly defined

\### Issues Encountered

\#### 4.1 Stack Organization (3 commits)

**Problem:** Monolithic stack vs separated concerns.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #24 | Split into storage and service stacks | Separated stateful from stateless |

| #4 | Major stack refactoring | Better organization and structure |

| #2 | Initial monolithic stack | Started with everything in one stack |

**Resolution Strategy:**

\- â Separate stateful resources (VPC, RDS, Cache) into storage-stack

\- â Put stateless compute (ECS services) in service-stack

\- â Use stack outputs and cross-stack references

\- â Define explicit dependencies between stacks

\- â Benefits: independent lifecycle, easier testing, faster iteration on services

\#### 4.2 Context & Configuration Management (3 commits)

**Problem:** CDK context and synthesizer warnings.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #5 | Fixing CDK warnings | Added proper synthesizer configuration |

| #6 | AZ lookup issues | Added cdk.context.json with AZ mappings |

| #6 | Added .env file | Environment-specific configuration |

**Resolution Strategy:**

\- â Use cdk.context.json to cache AZ lookups (avoid API calls)

\- â Configure DefaultStackSynthesizer properly

\- â Use .env files for environment-specific values

\- â Address CDK warnings during development, not later

\- â Version control cdk.context.json for team consistency

\#### 4.3 Resource References & Dependencies (2 commits)

**Problem:** Properly referencing resources across stacks.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #24 | Cross-stack references for storage resources | Export/import pattern |

| #40 | Secret reference syntax errors | Proper CDK secret constructs |

**Resolution Strategy:**

\- â Use `stack.export()` and `Fn.importValue()` for cross-stack refs

\- â Pass resources as constructor parameters when possible

\- â Use proper CDK constructs (Secret.fromSecretArn) instead of raw ARNs

\- â Define dependencies explicitly with `addDependency()`

\- â Document cross-stack dependencies in README

\---

\## 5. Docker/Container Pitfalls (15 commits)

\### Key Learnings

\- Build performance matters significantly for iteration speed

\- Multi-stage builds reduce image size and build time

\- User permissions are tricky with shared volumes

\- Base image selection impacts complexity

\### Issues Encountered

\#### 5.1 Build Performance (3 commits)

**Problem:** Docker builds were extremely slow (4+ minutes).

| Commit | Issue | Resolution |

|--------|-------|------------|

| #8 | Got docker building faster with UV | 4 min â 10 sec improvement |

| #8 | Implemented multi-stage builds | Separate builder and runtime stages |

| #39 | Simplified to leverage base image UV | Use apache/airflow's built-in tools |

**Resolution Strategy:**

\- â Use UV package manager for 25-50x faster pip installs

\- â Multi-stage builds: builder stage + lean runtime stage

\- â Copy pre-built virtual environment from builder

\- â Leverage capabilities of base image (apache/airflow has UV)

\- â Cache layers effectively by ordering Dockerfile commands

**Impact:** Build time: 4 minutes â 10 seconds (24x improvement)

\#### 5.2 Image Complexity (4 commits)

**Problem:** Over-complicated Docker image with unnecessary scripts.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #38 | Massive cleanup: removed 1057 lines | Removed test/debug scripts |

| #39 | Removed airflow.cfg file | Use environment variables only |

| #39 | Simplified Dockerfile by 16 lines | Leveraged base image features |

| #6 | Temporarily removed Docker files | Clean slate approach |

**Resolution Strategy:**

\- â Start with minimal Dockerfile extending apache/airflow base

\- â Avoid custom entrypoint scripts unless absolutely necessary

\- â Use environment variables instead of config files

\- â Remove debugging/testing scripts from production image

\- â Keep Dockerfile under 50 lines total

\#### 5.3 Local Development (3 commits)

**Problem:** Need to test Docker images locally before ECS.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #9 | Created Docker Compose for local testing | Full local environment |

| #10 | Got local dev working | Validated configuration locally |

| #26 | Used local deployment to fix ECS issues | Local testing found issues |

**Resolution Strategy:**

\- â Create docker-compose.yml matching ECS configuration

\- â Test all configuration locally before deploying to ECS

\- â Use same environment variables in both environments

\- â Validate database connectivity, secret injection, volumes locally

\- â Significantly reduces cloud debugging time and cost

\#### 5.4 Base Image & Dependencies (3 commits)

**Problem:** Managing Python dependencies and base image.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #7 | Added build\_and\_[push.sh](http://push.sh) for ECR | Automated image publishing |

| #8 | Used UV for dependencies | Faster installs |

| #15 | 'aws' CLI not found in image | Base image didn't include AWS CLI |

**Resolution Strategy:**

\- â Use official apache/airflow:3.1.0 as base image

\- â Only install additional dependencies if truly needed

\- â Use UV or pip with --no-cache-dir to minimize layer size

\- â Create automated build/push scripts for CI/CD

\- â Tag images with git commit SHA for traceability

\#### 5.5 Sidecar Containers (2 commits)

**Problem:** Running git-sync as sidecar with proper image.

| Commit | Issue | Resolution |

|--------|-------|------------|

| #20 | Added git-sync image to ECR | Mirrored [k8s.gcr.io/git-sync](http://k8s.gcr.io/git-sync) |

| #50 | Created GitLab CI for git-sync mirroring | Automated mirror updates |

**Resolution Strategy:**

\- â Mirror external images (k8s git-sync) to ECR for reliability

\- â Use sidecar pattern for orthogonal concerns (git sync, monitoring)

\- â Configure shared volumes between main and sidecar containers

\- â Automate image mirroring with CI/CD pipelines

\- â Document sidecar image sources and update procedures

\---

\## 6. Infrastructure as Code Best Practices Learned

\### From This Journey

1\. **Iterative Development is Key**

\- 54 commits show the value of small, incremental changes

\- Each commit isolated a specific problem

\- Easier to rollback and debug

2\. **Local Testing Saves Time & Money**

\- Docker Compose for local validation (commits #9, #10, #26)

\- Reduced ECS debugging iterations

\- Faster feedback loop

3\. **Separate Stateful from Stateless**

\- Storage stack (VPC, RDS, Cache) - commit #24

\- Service stack (ECS, ALB) can be destroyed/recreated quickly

\- Independent lifecycle management

4\. **Secrets Management**

\- Never hardcode secrets

\- Use Secrets Manager for all sensitive data

\- Proper URL encoding for special characters

5\. **Start Simple, Add Complexity**

\- Initial "AI slop" was too complex

\- Simplified over time (commits #38, #39)

\- Remove before adding

6\. **Documentation as You Go**

\- Git commit messages tell the story

\- Document pitfalls immediately

\- Future you will thank present you

\---

\## 7. Recommended Development Workflow

Based on lessons learned from 54 commits:

\### Phase 1: Foundation (Do This Right First)

1\. â Set up CDK project with proper structure

2\. â Create storage stack (VPC, RDS, Cache)

3\. â Configure secrets in Secrets Manager

4\. â Set up cdk.context.json with AZ mappings

5\. â Create .env for environment config

\### Phase 2: Docker Development

1\. â Create minimal Dockerfile extending apache/airflow

2\. â Set up docker-compose.yml for local testing

3\. â Test all Airflow services locally

4\. â Validate secrets, DB connection, volumes

5\. â Optimize build with UV/multi-stage

\### Phase 3: AWS Deployment (Incremental)

1\. â Deploy storage stack first

2\. â Push Docker image to ECR

3\. â Deploy webserver only (with ALB)

4\. â Deploy scheduler

5\. â Deploy triggerer

6\. â Deploy worker last (with auto-scaling)

\### Phase 4: Optimization

1\. â Enable health checks after services stable

2\. â Add circuit breaker

3\. â Configure auto-scaling

4\. â Add Spot instances for workers

5\. â Set up monitoring and alarms

\### Phase 5: Production Hardening

1\. â Enable secret rotation

2\. â Configure backup policies

3\. â Set up CI/CD pipelines

4\. â Document runbooks

5\. â Load testing and tuning

\---

\## 8. Cost Optimization Insights

\### What Worked

\- **Spot Instances for Workers** (commit #45): 50-70% cost savings

\- **ARM64 Architecture** (commits #13, #14): Better price/performance

\- **Separate Stacks** (commit #24): Can destroy/recreate services without affecting storage

\- **Auto-scaling** (commit #51): Only pay for capacity you use

\### What Didn't Work

\- **EFS** (commits #15-18): More complex and costly than git-sync

\- **Always-on development**: Could use dev/prod environment separation

\---

\## 9. Key Metrics

\### Development Journey

\- **Total Commits:** 54

\- **Major Refactors:** 3 (commits #4, #24, #38)

\- **Pitfall Fixes:** 47

\- **Days of Development:** ~10 days (Oct 28 - Nov 6, 2025)

\### Technical Debt Resolved

\- **Deleted Lines:** ~6,000+ (cleanup commits #38, #39, #52)

\- **Documentation Added:** 2,500+ lines

\- **Build Time Improvement:** 24x faster (4 min â 10 sec)

\### Final Architecture

\- **Stacks:** 2 (storage, service)

\- **ECS Services:** 4 (webserver, scheduler, worker, triggerer)

\- **Supporting Services:** 3 (RDS, Valkey, git-sync)

\- **Auto-scaling:** 1-10 workers based on load

\- **Spot Instances:** Enabled for workers

\---

\## 10. Top 10 Lessons Learned

1\. **Test Locally First** - Docker Compose saved countless hours debugging in AWS

2\. **URL-Encode Passwords** - Special characters in passwords will break everything

3\. **Use Git-Sync, Not EFS** - Simpler, cheaper, more reliable for DAG deployment

4\. **Separate Stateful/Stateless** - Independent lifecycle = faster iteration

5\. **UV Package Manager** - 24x faster Docker builds

6\. **Start Simple** - Remove complexity before adding features

7\. **Security Groups Matter** - Document all connectivity requirements

8\. **Health Check Grace Periods** - DB-dependent services need 300-600 seconds

9\. **Spot Instances for Workers** - 50-70% cost savings, minimal impact

10\. **Commit Often** - Small commits make debugging and rollback easier

\---

\## 11. If Starting Over, Do This

\### Skip These Mistakes

\- â Don't use static airflow.cfg files

\- â Don't start with all services at once

\- â Don't use EFS for DAGs (use git-sync)

\- â Don't ignore CDK warnings

\- â Don't skip local testing

\- â Don't generate passwords with special characters (or URL-encode them)

\- â Don't use complex entrypoint scripts

\### Do These Things

\- â Start with storage stack + webserver only

\- â Use UV for fast Docker builds from day 1

\- â Set up docker-compose.yml immediately

\- â Use environment variables exclusively

\- â Configure Spot instances from the start

\- â Document as you go

\- â Use git-sync for DAG deployment

\### Time Saved

Following this guide could reduce development time from **~80 hours to ~20 hours**, avoiding the 47 pitfall commits.

\---

\## Conclusion

This journey through 54 commits demonstrates the iterative nature of cloud infrastructure development. The key insight is that **failure is part of the learning process**, and each commit represents a lesson learned.

The most valuable outcome isn't just a working Airflow deployment, but the understanding of:

\- How ECS services communicate

\- Why certain patterns work (git-sync) and others don't (EFS)

\- The importance of local testing

\- How to structure IaC for maintainability

These lessons are transferable to any ECS/Fargate deployment, not just Airflow.

**Final Architecture Success Rate:** 100% (after 54 commits and ~47 fixes)

**Would Do It Again:** Yes, with this document as a guide