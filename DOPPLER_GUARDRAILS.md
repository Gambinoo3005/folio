# Doppler Security Guardrails & Policy

## Overview
This document outlines the security policies and operational procedures for managing secrets in the Folio Platform Doppler project.

## Secret Rotation Policy

### Quarterly Rotation Schedule
The following secrets must be rotated every 3 months:

- **Clerk Authentication**
  - `CLERK_SECRET_KEY`
  - `CLERK_JWT_KEY`
  
- **Stripe Billing**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  
- **Cloudflare Media**
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_IMAGES_TOKEN`
  
- **Email Service**
  - `RESEND_API_KEY`
  
- **Background Jobs**
  - `INNGEST_EVENT_KEY`
  - `INNGEST_SIGNING_KEY`
  
- **Monitoring**
  - `SENTRY_DSN`
  - `AXIOM_TOKEN`

### Rotation Process
1. Generate new credentials in respective service dashboards
2. Update secrets in Doppler (production first, then staging, then dev)
3. Test functionality in each environment
4. Document rotation date and reason in Doppler change log
5. Update team via Slack/email notification

## Environment Separation

### Production Isolation
- **NEVER** reuse production secrets in development or staging
- Use separate service accounts/API keys for each environment
- Production secrets are ONLY stored in `prd_main` config
- Staging and development use their own dedicated service accounts

### Environment-Specific Services
- **Development**: Use free/trial tiers where possible
- **Staging**: Use separate paid accounts with limited resources
- **Production**: Use full production accounts with monitoring

## Logging Security

### Secret Masking
- All logging libraries must mask sensitive values
- Use structured logging with automatic redaction
- Never log full API keys, tokens, or connection strings
- Log only first/last 4 characters of sensitive values

### Audit Trail
- All secret changes are logged in Doppler with timestamps
- Include reason and ticket reference for each change
- Regular audit of access logs (monthly)

## Access Control

### Doppler Project Access
- **Core team only**: Restrict to essential personnel
- Use role-based access (read-only for most, admin for leads)
- Regular access reviews (quarterly)
- Remove access immediately when team members leave

### Vercel Integration Tokens
- Use least-privilege tokens for integrations
- Tokens should only have access to specific projects
- Rotate integration tokens annually
- Monitor token usage for anomalies

## Change Management

### Secret Updates
Every secret edit requires:
- **Reason**: Why the change is needed
- **Ticket/Reference**: Link to issue or PR
- **Impact**: Which services will be affected
- **Testing**: Verification steps completed

### Approval Process
- **Development**: Self-approval for placeholder updates
- **Staging**: Team lead approval required
- **Production**: Requires 2-person approval (lead + senior)

## Disaster Recovery

### Backup Strategy
- **Quarterly encrypted exports** of all secrets
- Store backups in secure, access-controlled location
- Test restore procedures annually
- Document recovery procedures

### Incident Response
- **Immediate**: Rotate compromised secrets
- **Short-term**: Audit access logs and usage
- **Long-term**: Review and strengthen security policies

## Compliance & Monitoring

### Regular Reviews
- **Monthly**: Access log review
- **Quarterly**: Secret rotation and access audit
- **Annually**: Full security policy review

### Monitoring
- Set up alerts for unusual secret access patterns
- Monitor failed authentication attempts
- Track secret usage across environments

## Team Responsibilities

### Security Lead
- Oversee rotation schedule
- Approve production changes
- Conduct security reviews

### Development Team
- Follow change management procedures
- Report security concerns immediately
- Participate in security training

### Operations Team
- Maintain backup procedures
- Monitor system health
- Execute incident response

## Emergency Procedures

### Compromised Secret
1. **Immediately** rotate the compromised secret
2. Audit access logs for unauthorized usage
3. Notify security team and stakeholders
4. Document incident and lessons learned
5. Update security procedures if needed

### Service Outage
1. Check Doppler service status
2. Verify Vercel integration health
3. Use backup env files if needed
4. Escalate to Doppler support if required

## Contact Information

- **Security Lead**: [To be assigned]
- **Doppler Support**: support@doppler.com
- **Emergency Contact**: [To be defined]

---

**Last Updated**: September 22, 2025  
**Next Review**: December 22, 2025  
**Version**: 1.0
