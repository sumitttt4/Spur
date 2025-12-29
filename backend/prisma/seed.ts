import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create a demo conversation
    const conversation = await prisma.conversation.create({
        data: {
            messages: {
                create: [
                    {
                        role: 'user',
                        content: 'Hello, I have a question about shipping.',
                    },
                    {
                        role: 'assistant',
                        content: 'Hi there! I\'d be happy to help. We ship worldwide. Standard shipping is $5, and it\'s free for orders over $50.',
                    },
                ],
            },
        },
    });

    console.log(`Created demo conversation with ID: ${conversation.id}`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
