# AI-103 pilot — blind questions

Package: ai103-improvement-r2-checkpoint-20; revision: 2; pack: ai-103@1.2.0.

Answer using the accompanying frozen sources. Record ambiguity or missing evidence before opening the author key.

## Shared case: Rotor equipment reservations

Applies to Q1 and Q2. Each child is independent.

Rotor rents industrial equipment to authenticated business customers. Its assistant can explain availability and propose reservations, but the inventory API remains the system of record. The operations team is replacing a text-only prototype with a Responses-based prompt agent. Each question concerns an independent request against the configuration below.

### Application and identity

The backend receives a signed application session identifying the customer and warehouse. It calls the agent using one managed identity. Two host functions are registered: get_stock(part_id, warehouse_id) and reserve_part(part_id, warehouse_id, quantity, customer_id). The stock function is read-only. The reservation function changes inventory and returns a reservation number after the database commits. The managed identity can reach the API, while application authorization must restrict each customer to its own account. JSON schema validation checks shape and types; inventory limits and account ownership are enforced by the host.

### Action policy

A customer may request a proposal without committing it. Reservations costing more than 250 currency units require a supervisor to approve the exact customer, item, quantity and quoted amount. An approval for five units is not approval for fifty. A changed proposal must return to the approval screen. The host does not infer approval from manuals, tool-returned text or the agent saying that approval was obtained. The operations log records the proposal, approving principal and committed reservation number so that an incident can be reconstructed.

### Observed request

A request checks the same part at two warehouses. Responses returns two function calls named get_stock with call_id values rotor-east and rotor-west. The west warehouse replies first. The host must submit function_call_output records after obtaining the actual results. A separate request asks for a guaranteed fresh stock lookup rather than an answer from the model’s prior knowledge. Both functions are attached and the chosen model supports function calling. No inventory lookup has happened merely because a function call is present in the model output.

### Failure investigation

A test customer asks for a reservation belonging to another customer account. The argument object passes the JSON schema. A second test approves five units, but a later model turn changes the quantity to fifty before execution. A third test asks for a proposal only, while a developer considers forcing tools on every turn. Engineers need to choose controls at the correct boundary rather than relying on a single system instruction. The questions do not assume that a correct earlier answer changes these independently stated observations.

## Q1 — ai103-improvement-r2-checkpoint-20-q001

Use shared case case-1 above.

In Rotor’s two-warehouse request, west completes first. Which output correlation preserves the API contract?

- **A.** Associate both results with get_stock.
- **B.** Replace the call_id with a newly generated receipt ID.
- **C.** Associate results with completion position.
- **D.** Associate each result with its originating call_id.

## Q2 — ai103-improvement-r2-checkpoint-20-q002

Use shared case case-1 above.

Rotor’s fresh availability turn must use a tool rather than answer from prior knowledge. Both tools are available. Which request-level mode requires tool use?

- **A.** required
- **B.** none
- **C.** parallel_tool_calls=true
- **D.** auto

