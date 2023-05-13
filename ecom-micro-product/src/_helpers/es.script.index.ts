// import { ESClientSingle } from '../factories/es.client';

// async function createItemIndex() {

//     const client = ESClientSingle.buildESClient();

//     try {
//         await client.indices.create({
//             index: 'items',
//             body: {
//                 mappings: {
//                     properties: {
//                         id: { type: 'keyword' },
//                         name: { type: 'text' },
//                         description: { type: 'text' },
//                         price: { type: 'scaled_float', scaling_factor: 100 },
//                         otherDetails: { type: 'text' },
//                         createdAt: { type: 'date' },
//                         updatedAt: { type: 'date' },
//                     },
//                 },
//             },
//         });

//         console.log('Items index created');
//     } catch (error) {
//         console.error('Error creating items index:', error);
//     }
// }

// createItemIndex();