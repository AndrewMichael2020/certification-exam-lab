# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Lumen regional engineering assistant

Applies to Q1 and Q2 and Q3 and Q4. Each child is independent.

Lumen operates an engineering assistant for staff in the European Union. Its platform team is designing deployment, identity and retrieval controls together, with separate principals for deployment and runtime. The service must answer interactively and retain existing learner and operational records during the migration described here.

### Workload boundary

The processing policy permits inference across EU countries but forbids processing outside that data zone. Interactive requests cannot wait for a nightly batch. Demand varies across the day and procurement wants on-demand token billing rather than reserved throughput. The selected model is available for every deployment family considered in the questions, and the relevant quota has already been confirmed. The resource’s region alone is not the organization’s definition of the inference processing boundary.

### Inference identity

The backend calls an Azure OpenAI resource through its /openai/v1/ endpoint using Microsoft Entra credentials. Its runtime managed identity currently has Reader on that resource and no inference data role. Token acquisition succeeds, but inference is denied. The team wants the documented inference role at the resource scope without granting model-management permissions. Developers’ personal roles and the GitHub deployment principal are separate from the runtime identity. A resource key is not part of the approved runtime design.

### Project and Search

An AI Projects Python 2.8.0 client is used for Foundry project operations, with a project endpoint and an Entra credential. Search public access is disabled. The private endpoint exists, and the agent connection is explicitly pinned to the named runtime principal. That principal has Search Index Data Reader for the target index. From the runtime subnet, however, the Search hostname resolves to a public address. From a developer laptop on another network it resolves privately and querying succeeds. The network observations do not transfer from the laptop to the agent subnet.

### Release process

A GitHub deployment workflow obtains a token using an established OIDC trust. It does not store a client secret. The workflow principal’s project role is assigned on a different project, while its endpoint variable points to the intended Lumen project. An authorization denial therefore needs identity and scope analysis after authentication succeeds. Operations retain redacted request spans and release identifiers to investigate failures. Each question asks for a single independent decision; repairing one defect is not assumed to repair the others. A proposed change must satisfy the named runtime, region and billing facts rather than simply resemble a working developer setup.

### Diagnostic exhibit

Runtime exhibit: {"tokenAcquired":true,"inferenceRole":"Reader","searchRole":"Search Index Data Reader","searchDns":"public address","publicSearchAccess":false}. These observations belong to the runtime identity and subnet; the developer’s successful call uses a different network.

## Q1 — ai103-improvement-r2-set-a-100-q009

Use shared case case-3 above.

Which deployment fits Lumen’s interactive EU-processing and on-demand billing requirements?

- **A.** Global Standard in an EU resource.
- **B.** Data Zone Standard in the EU.
- **C.** Data Zone Provisioned.
- **D.** Data Zone Batch.

## Q2 — ai103-improvement-r2-set-a-100-q010

Use shared case case-3 above.

Lumen’s runtime obtains a token but Reader-only inference is denied. Which documented role at the called Azure OpenAI resource supplies inference permission?

- **A.** A deployment workflow’s role on another project.
- **B.** Reader on the Foundry project only.
- **C.** Cognitive Services OpenAI User.
- **D.** Search Index Data Reader.

## Q3 — ai103-improvement-r2-set-a-100-q011

Use shared case case-3 above.

Lumen’s Search role is correct, but the runtime resolves Search publicly. What should be repaired first?

- **A.** The runtime principal’s model-token quota.
- **B.** The semantic configuration on the Search index.
- **C.** The developer laptop’s working Search role.
- **D.** Private DNS resolution and subnet links.

## Q4 — ai103-improvement-r2-set-a-100-q012

Use shared case case-3 above.

Lumen’s OIDC token succeeds but deployment is denied. Which authorization correction targets the case defect?

- **A.** Change the runtime Search role.
- **B.** Use the endpoint string as a credential.
- **C.** Scope the workflow’s deployment role to the intended project.
- **D.** Rotate a long-lived secret into GitHub.

