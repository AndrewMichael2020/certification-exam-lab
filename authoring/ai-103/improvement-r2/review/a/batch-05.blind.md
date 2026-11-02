# AI-103 pilot — blind questions

Package: ai103-improvement-r2-set-a-100; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Q1 — ai103-improvement-r2-set-a-100-q017

An interactive assistant may process requests across EU countries but cannot process them outside the EU. Usage varies, and the team wants token-based billing. The model supports all listed types. Which deployment fits?

- **A.** Data Zone Standard, using EU capacity with token-based charges for interactive requests.
- **B.** Global Standard in an EU resource, relying on the resource region to keep inference processing within the EU.
- **C.** Data Zone Batch, submitting requests to the asynchronous batch queue.
- **D.** Data Zone Provisioned, with EU processing and reserved throughput.

## Q2 — ai103-improvement-r2-set-a-100-q018

A service has predictable sustained model traffic and needs allocated throughput. Its processing boundary is already satisfied by the chosen region. Which deployment characteristic should drive the selection?

- **A.** Developer deployment for experimentation with the selected model.
- **B.** Batch processing with deferred completion for groups of requests.
- **C.** Standard token billing with capacity shared across on-demand requests.
- **D.** Provisioned capacity with a throughput commitment.

## Q3 — ai103-improvement-r2-set-a-100-q019

Developers have scoped Foundry RBAC roles, but a shared resource key authenticates the application. A developer can perform an operation that their role excludes. Which change makes the role assignments effective for those calls?

- **A.** Move the application behind a private endpoint while retaining key authentication.
- **B.** Rotate the shared resource key and continue assigning each developer the same key.
- **C.** Store the shared key in a vault and distribute it to authorized developers.
- **D.** Authenticate with Entra identities carrying the intended scoped roles.

## Q4 — ai103-improvement-r2-set-a-100-q020

A secured agent has the required runtime roles. Search resolves to a public IP from the agent network even though public access is disabled. The private endpoint exists. What should be investigated next?

- **A.** Private DNS resolution and links for the agent network.
- **B.** The query-time semantic ranking configuration on the target index.
- **C.** The private endpoint connection approval state for the runtime subnet.
- **D.** The Search role assignments on the identity used by the deployment pipeline.

## Q5 — ai103-improvement-r2-set-a-100-q021

A Foundry managed-compute preview deployment needs more accelerators. Matching GPU VM quota is available in the same region. Which quota should the team request?

- **A.** Request a larger subscription-wide regional vCPU allocation and count that capacity toward the Foundry managed-compute accelerator deployment.
- **B.** An increase to the classic managed-endpoint GPU VM-family quota for that region.
- **C.** Request the regional accelerator-SKU allocation through the Foundry managed-compute quota process.
- **D.** Additional tokens per minute on the serverless language model deployment.

## Q6 — ai103-improvement-r2-set-a-100-q022

A hosted agent returns session_quota_exceeded. Several sessions no longer need active compute, but their stored state is still required. What should the operator do?

- **A.** Stop the inactive sessions that are consuming active capacity.
- **B.** Delete the completed sessions together with their stored conversation state.
- **C.** Increase the model deployment’s reserved inference throughput.
- **D.** Increase the tokens-per-minute allocation for the underlying chat model.

## Q7 — ai103-improvement-r2-set-a-100-q023

A GitHub workflow must deploy a hosted agent with no long-lived Azure credential stored in GitHub. Which identity setup fits the documented deployment pattern?

- **A.** A client-secret credential copied into GitHub and rotated before each release.
- **B.** A project endpoint variable used as the workflow's authentication credential.
- **C.** Federated OIDC authentication with a scoped deployment identity.
- **D.** The runtime agent identity inferred from the agent name in the workflow file.

## Q8 — ai103-improvement-r2-set-a-100-q024

An agent request traverses retrieval, generation and a business tool. Engineers need to attribute a latency increase to one operation and its parent request. Which telemetry structure supports that?

- **A.** Timed service events whose correlation key is the service name shared by all requests.
- **B.** Record a structured event for each request containing final text, total elapsed time and the names of every participating service.
- **C.** Export a correlated request trace with timed nested spans for retrieval, generation and the tool call.
- **D.** Independent traces for each operation, each with a newly generated request identifier.

## Q9 — ai103-improvement-r2-set-a-100-q025

Tool arguments include account numbers and an access token. Engineers need useful traces for incident diagnosis. Which collection policy best fits?

- **A.** Export full content spans to a restricted workspace, then delete secrets in a nightly job.
- **B.** Store raw access tokens in encrypted span attributes accessible to incident responders.
- **C.** Remove the request and evaluation identifiers while preserving raw tool arguments.
- **D.** Redact sensitive fields before export and preserve safe correlation data.

