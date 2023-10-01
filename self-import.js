const http = require('http');

module.exports = function (RED) {
    function SelfImportNode(config) {
        RED.nodes.createNode(this, config);
        this.token = config.token;
        this.tabId = config.tabId;
        var node = this;

        node.on('input', async function (msg) {
            try {
                let newFlow = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload;

                const getOptions = {
                    hostname: 'localhost',
                    port: 1880,
                    path: '/flows',
                    method: 'GET',
                    headers: {
                        'Authorization': node.token ? `Bearer ${node.token}` : ''
                    }
                };

                const existingFlows = await new Promise((resolve, reject) => {
                    const req = http.request(getOptions, (res) => {
                        let data = '';
                        res.on('data', (chunk) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            resolve(JSON.parse(data));
                        });
                    });
                    req.on('error', (error) => {
                        reject(error);
                    });
                    req.end();
                });

                // Find and update the "northstar" comment node
                const northStarNode = existingFlows.find(n => n.type === "comment" && n.name === "northstar");
                if (northStarNode) {
                    newFlow.forEach(n => {
                        n.x += northStarNode.x; 
                        n.y += northStarNode.y + 20;
                    });
                    northStarNode.y += 50;  // Move "northstar" 50 pixels down
                }

                // Set the 'z' property for each new node
                newFlow.forEach(n => {
                    n.z = node.tabId;
                });

                // Merge and deploy
                const mergedFlows = existingFlows.concat(newFlow);

                const postOptions = {
                    hostname: 'localhost',
                    port: 1880,
                    path: '/flows',
                    method: 'POST',
                    headers: {
                        'Authorization': node.token ? `Bearer ${node.token}` : '',
                        'Content-Type': 'application/json'
                    }
                };

                const req = http.request(postOptions, (res) => {
                    res.on('data', (data) => {
                        msg.payload = data;
                        node.send(msg);
                    });
                });

                req.on('error', (error) => {
                    node.error(error);
                });

                req.write(JSON.stringify(mergedFlows));
                req.end();

            } catch (err) {
                node.error(err);
            }
        });
    }

    RED.nodes.registerType("self-import", SelfImportNode, {
        defaults: {
            token: { value: "" },
            name: { value: "" },
            tabId: { value: "" }
        }
    });
};
