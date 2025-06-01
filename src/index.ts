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

server.tool(
    'update-coding-status',
    'Updates the bulb color based on coding status',
    {
        status: z.enum(['success', 'error', 'warning', 'coding', 'rainbow']).describe('Coding status to reflect on the bulb')
    },
    async ({ status }) => {
        let r = 0, g = 0, b = 0, dimming = 100;
        switch (status) {
            case 'success':
                r = 0; g = 255; b = 0; // Green
                break;
            case 'error':
                r = 255; g = 0; b = 0; // Red
                break;
            case 'warning':
                r = 255; g = 255; b = 0; // Yellow
                break;
            case 'coding':
                r = 0; g = 0; b = 255; // Blue
                break;
            case 'rainbow':
                // Rainbow effect: cycle through colors
                const now = Date.now();
                const cycle = 5000; // 5 seconds per cycle
                const t = (now % cycle) / cycle;
                r = Math.floor(255 * Math.sin(t * Math.PI * 2));
                g = Math.floor(255 * Math.sin((t + 1 / 3) * Math.PI * 2));
                b = Math.floor(255 * Math.sin((t + 2 / 3) * Math.PI * 2));
                break;
        }
        await changeColor({ r, g, b, dimming });
        return {
            content: [{ type: 'text', text: `Bulb updated to reflect ${status} status` }]
        };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Philips Bulb MCP Server running on stdio');
}

main();