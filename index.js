import Discord from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const url = 'https://waifu.it/api/v4'

const client = new Discord.Client({ intents: 131071, partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT'], allowedMentions: { parse: ['users'] } });

client.on('ready', () => {
    console.log(`${client.user.tag}, 成員數: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} ，伺服器數: ${client.guilds.cache.size}`);
    const activity = () => client.user.setActivity(`我是超級可愛的二次元機器人喵！ || Made By Tails`, { type: Discord.ActivityType.Playing });
    activity();
    setInterval(activity, 600000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('w!')) return;
    message.content = message.content.slice(2);
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'wife') {
        let config = {
            headers: {
                Authorization: process.env['WAIFU-TOKEN'],
            },
        };
        if (args.length > 0) {
            config.params = {
                name: args.join(' '),
            };
        };
        const { data } = await axios.get(`${url}/waifu`, config);
        message.channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`${data.name.native} ${data.name.full}`)
                .setImage(data.image.large)
                .setColor('Random')]
        });
    }
});

client.login(process.env['DISCORD-TOKEN']);
