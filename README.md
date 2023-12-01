# Telephony Module

### Context

* session data <auth>
* mizu <web_phone.js>

### Linkus SDK

[documentation](https://help.yeastar.com/en/p-series-linkus-appliance-edition/linkus-sdk-guide/linkus-sdk-for-web-overview.html)

---

### Case Init

1. `web_phone.js` <script /> loading
2. `web_phone.js` initializing
   1. agent status webSocket listen => zustand store
3. `web_phone.js` loaded mizu init (session sip credentials)
   1. backend api agent status => get yeastar agent status
   2. on_register_state_change => agent status webSocket emit (agent information)
4. mizu init success mizu on_call_state_change
   1. call_stack listen => save incoming and outgoing events in array
   2. in_bound_ringing listen
   3. in_bound_connect listen
   4. out_bound_ringing listen
   5. out_bound_connect listen
   6. webSocket listen call_log queue number
      1. set_state (queue_name, server_call_log_token, yeastar_call_id, queue_number)
      2. set_attendant_transfer_form_data (channel_id)

---

### Case Inbound Ringing

1. get ph number from mizu `peername` => backend contact api (create new contact if not exists else return existing contact) => call_log store
2. call_from(mizu) , call_to (session) => call_log store
3. extension_id session data store => call_log store
4. duration (0), type (inbound), status (ringing) => call_log store
5. call_log store => backend api create call_log

---

### Case Inbound Connect

1. timer start
2. status (talking) => call_log store
3. call_from (mizu) , call_to (session) => call_log store
4. duration (0), type (inbound), contact_id => call_log store
5. call_log store => backend api create call_log (update)

---

### Case Outbound Ringing

1. mizu call_stack `peername` => backend contact api (create new contact if not exists else return existing contact) => call_log store
2. call_from (session), call_to (mizu call_stack) => call_log store
3. type (outbound), duration (0), status (ringing) => call_log store
4. call_log store => backend api create call_log

---

### Case Outbound Connect

1. timer start
2. call_from (session), call_to (mizu call_stack) => call_log store
3. type (outbound), duration (0), status (talking) => call_log store
4. call_log store => backend api create call_log (update)

---

### Case Ongoing Call

1. status (talking) => call_log store

---

### Case Call End (Inbound / Outbound)

1. webSocket listen call_log queue number
	1. clear set_state (queue_name, server_call_log_token, yeastar_call_id, queue_number)
	2. clear attendant_transfer_form_data (channel_id)
2. timer stop
3. duration (timer), status (missed/answered/no_answered) => call_log store
4. call_draft or end
	1. if (status == missed || status == no_answered) => clear all data
	2. else => call draft

---

### Case Blind Transfer

1. get agents presence status web socket
2. blind transfer
   1. if (agent not active) => show toast error
   2. else => transfer , call_end

---

### Case Attendant Transfer

1. get agents presence status web socket

---

### Case DTMF

1. dtmf input => debounced 2s
2. dtmf trigger
