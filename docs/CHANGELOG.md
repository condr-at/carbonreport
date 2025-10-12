# Changelog

All notable changes to the Carbon Report Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Requirements specification v0.0.1
- Git repository initialization

## [0.0.1] - 2025-10-11

### Added
- System Requirements Specification document
- Core functional flow definition
- Data model and entity schemas
- Technology stack recommendations
- MVP scope boundaries

### Decided
- Next.js + TypeScript for frontend
- NestJS/Express for backend API
- PostgreSQL + Prisma for database
- Resend for transactional emails
- JWT authentication (OAuth post-MVP)
- Manual save (no autosave in MVP)
- Browser print-to-PDF export
- 10 MB file upload limit
- 24h access token, 30-90d refresh token

### Deferred to Post-MVP
- Admin interface
- Multi-user organizations
- OAuth providers
- Real-time collaboration
- OCR/LLM automation
- Billing and subscriptions
- Mobile applications
- Advanced analytics

---

[Unreleased]: https://github.com/yourusername/carbonreport/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/yourusername/carbonreport/releases/tag/v0.0.1
