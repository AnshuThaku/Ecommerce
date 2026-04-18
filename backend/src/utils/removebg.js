const axios = require('axios');
const FormData = require('form-data');

const removeBackground = async (imageBuffer) => {
    try {
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', imageBuffer, { filename: 'image.jpg' });

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': process.env.REMOVE_BG_API_KEY,
            },
            responseType: 'arraybuffer', // Hume output buffer mein chahiye
        });

        return response.data; // Ye transparent PNG ka buffer hai
    } catch (error) {
        console.error('Remove.bg Error:', error.response ? error.response.data.toString() : error.message);
        throw new Error('Background removal failed');
    }
};

module.exports = { removeBackground };