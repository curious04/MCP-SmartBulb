import {
    McpServer
} from '@modelcontextprotocol/sdk/server/mcp.js';

import {
    StdioServerTransport
} from '@modelcontextprotocol/sdk/server/stdio.js';

import {
    z
} from 'zod';

import {
    turnOffBulb,
    turnOnBulb,
    changeColor
} from './service';

const server = new McpServer({
    name: 'Philips Smart Bulb',
    version: '1.0.0',
    capabilities: {
        resources: {},
        tools: {},
    },
});

server.tool('turn-on-bulb', 'Turns the bulb on', async () => {
    await turnOnBulb();
    return {
        content: [{
            type: 'text',
            text: 'Bulb has been turned on'
        }]
    };
});

server.tool('turn-off-bulb', 'Turns the bulb OFF', async () => {
    await turnOffBulb();
    return {
        content: [{
            type: 'text',
            text: 'Bulb has been turned off'
        }]
    };
});

server.tool(
    'change-bulb-color',
    'Changes the color of the bulb', {
        r: z.number().describe('Red Color of the light 0 255'),
        g: z.number().describe('Green Color of the light 0 - 255'),
        b: z.number().describe('Blue Color of the light 0 - 255'),
        dimming: z.number().describe('Dimming of light where 0 means no light, 100 means full and 50 means 50% brightness'),
    },
    async ({
        r,
        g,
        b,
        dimming
    }) => {
        await changeColor({
            b,
            dimming,
            g,
            r,
        });
        return {
            content: [{
                type: 'text',
                text: 'Bulb has been turned off'
            }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Philips Bulb MCP Server running on stdio');
}

main();