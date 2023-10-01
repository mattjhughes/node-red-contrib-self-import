node-red-contrib-self-import
A Node-RED node to dynamically import flows into a running Node-RED instance.
Installation
Install node-red-contrib-self-import via Node-RED's Manage Palette or npm:
bash

Copy code
npm install node-red-contrib-self-import
Features
* Import flows into an existing or new tab.
* Option to position the imported nodes relative to a "northstar" comment node.
Usage
To use the node, simply drag it into your Node-RED flow.
Inputs
* msg.payload: The payload must contain a JSON object or array that represents the Node-RED flow to be imported.
Outputs
* A message containing the result of the flow import.
Configuration
* API Token: Optional. The API token for the Node-RED admin API.
* Tab ID (z): The ID of the tab where the nodes from the imported flow will be placed.
How It Works
* 		API Token: If provided, the token will be used for authenticating with the Node-RED admin API.
* 		Tab ID (z): This is the ID of the tab where you want to place the imported nodes.
The node uses the Node-RED Admin API to:
* Fetch existing flows
* Merge the new flow from msg.payload into the existing flows
* Optionally align the imported nodes relative to a "northstar" comment node
* Deploy the merged flows back to the Node-RED instance
Example Flow
* 		Inject Node: Configured to inject the flow JSON into msg.payload.
* 		Self-Import Node: Takes the msg.payload and imports it into the Node-RED tab specified by the Tab ID.
* 		Debug Node: Outputs the result of the flow import.
Error Handling
If an error occurs during the import process, the node will log the error and output an error message in msg.payload.
