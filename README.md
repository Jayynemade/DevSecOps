# 🚀 ReactNodeApp — DevSecOps CI/CD Pipeline

A fully automated **DevSecOps pipeline** for a React + Node.js application, built with Jenkins. This pipeline weaves security scanning directly into the delivery process — from static code analysis to dependency auditing to container image scanning — so vulnerabilities are caught long before they reach production.

![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-D24939?logo=jenkins&logoColor=white)
![SonarQube](https://img.shields.io/badge/Code%20Quality-SonarQube-4E9BCD?logo=sonarqube&logoColor=white)
![OWASP](https://img.shields.io/badge/Security-OWASP%20Dependency--Check-orange?logo=owasp&logoColor=white)
![Trivy](https://img.shields.io/badge/Vulnerability%20Scan-Trivy-1904DA?logo=aquasecurity&logoColor=white)
![Docker](https://img.shields.io/badge/Containerized-Docker-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Runtime-Node.js%2018-339933?logo=node.js&logoColor=white)

---

## 📖 Overview

This repository ships a **Jenkins Declarative Pipeline** (`Jenkinsfile`) that takes a React frontend and Node.js backend all the way from source code to a running, security-vetted deployment. The pipeline is designed around the **"shift-left" security principle** — code quality gates, dependency checks, and vulnerability scans run *before* anything is built or deployed, catching issues as early and cheaply as possible.

## 🧭 Pipeline Flow

<img width="500" height="827" alt="Screenshot 2026-07-02 at 1 37 43 PM" src="https://github.com/user-attachments/assets/edf3aa2f-7241-442f-bcc1-7d926f9a1d92" />


## 🛠️ Stage-by-Stage Breakdown

| # | Stage | Purpose |
|---|-------|---------|
| 1 | **SonarQube Analysis** | Runs `sonar-scanner` against the codebase to surface bugs, code smells, and security hotspots. |
| 2 | **OWASP Dependency Check** | Scans project dependencies against the National Vulnerability Database (NVD) and publishes a report. |
| 3 | **Sonar Quality Gate Scan** | Waits (up to 2 minutes) on SonarQube's quality gate verdict before proceeding. |
| 4 | **Trivy Scan (Filesystem)** | Scans the repository filesystem for vulnerabilities, secrets, and misconfigurations. |
| 5 | **Install Dependencies** | Installs backend and frontend `npm` packages **in parallel** for faster builds. |
| 6 | **Test** | Runs backend and frontend test suites **in parallel**. |
| 7 | **Lint Frontend** | Enforces code style and catches issues via `npm run lint`. |
| 8 | **Build Frontend** | Produces a production-ready frontend build. |
| 9 | **Build Docker Images** | Builds backend and frontend containers using `docker compose build`. |
| 10 | **Trivy Docker Image Scan** | Scans built images for `HIGH`/`CRITICAL` CVEs and exports HTML/TXT reports. |
| 11 | **Deploy** | Tears down any existing stack and redeploys via `docker compose up -d`. |

## 🔐 Security Tools Used

- **[SonarQube](https://www.sonarsource.com/products/sonarqube/)** — Static Application Security Testing (SAST) & code quality gate
- **[OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)** — Software Composition Analysis (SCA) for known CVEs in dependencies
- **[Trivy](https://aquasecurity.github.io/trivy/)** — Filesystem *and* container image vulnerability scanning
- **Jenkins Declarative Pipeline** — Orchestration, parallelization, and workspace hygiene

## ✅ Prerequisites

Before running this pipeline, ensure your Jenkins environment has:

- **Jenkins plugins**: `NodeJS`, `SonarQube Scanner`, `OWASP Dependency-Check`, `Timestamper`, `Docker Pipeline`
- **Global Tool Configuration**:
  - NodeJS installation named `Node18`
  - SonarQube Scanner tool named `Sonar`
  - OWASP Dependency-Check installation named `dc`
- **SonarQube server** configured under *Manage Jenkins → System → SonarQube servers* as `Sonar`
- **Docker & Docker Compose** installed on the Jenkins agent
- **Trivy** installed and available on the `PATH` of the Jenkins agent
- A `docker-compose.yml` at the repo root defining `reactnodeapp-backend` and `reactnodeapp-frontend` services

## 📂 Expected Repository Structure

```
.
├── Jenkinsfile
├── docker-compose.yml
├── backend/
│   ├── package.json
│   └── ...
└── frontend/
    ├── package.json
    └── ...
```

## ⚙️ Pipeline Configuration Highlights

- **Timeouts**: Global 2-hour build timeout; a dedicated 2-minute timeout guards the Sonar quality gate wait so the pipeline never hangs indefinitely.
- **Build retention**: Keeps the last **10 builds** via `buildDiscarder`.
- **Timestamps**: Every console log line is timestamped for easier debugging.
- **Parallel stages**: Dependency installation and testing run concurrently for backend and frontend to cut pipeline runtime.
- **Non-blocking quality gate**: `abortPipeline: false` means a failed Sonar quality gate is reported but doesn't stop the pipeline — adjust this to `true` for stricter enforcement.
- **Workspace cleanup**: `cleanWs()` runs in the `post` block on every build, success or failure.

## 📊 Reports Generated

| Report | Description |
|--------|--------------|
| `dependency-check-report.xml` | OWASP Dependency-Check results (CVE findings per dependency) |
| `trivy-fs-report.html` | Trivy filesystem scan report |
| `backend-trivy-report.txt` | Trivy scan of the backend Docker image |
| `frontend-trivy-report.txt` | Trivy scan of the frontend Docker image |

## ▶️ Running the Pipeline

1. Create a new **Pipeline** job in Jenkins (or use Multibranch Pipeline for PR-based workflows).
2. Point it to this repository and set the script path to `Jenkinsfile`.
3. Configure the required tools and credentials listed under [Prerequisites](#-prerequisites).
4. Trigger a build — either manually or via a webhook on push/PR.
5. Review the SonarQube dashboard and Trivy/OWASP reports published on the build page.
6. On success, the app is live via `docker compose up -d`.

## 🗺️ Roadmap Ideas

- [ ] Fail the build on `CRITICAL` Trivy findings instead of just reporting them
- [ ] Push scanned images to a container registry (ECR/DockerHub/GHCR)
- [ ] Add Slack/Teams notifications in the `post` block
- [ ] Integrate secrets scanning (e.g., Gitleaks) as an early stage
- [ ] Add a staging environment with manual approval before production deploy

---

<p align="center">Built with ❤️ for shipping secure software, faster.</p>
