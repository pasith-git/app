import axios from "axios";

export const sendMessageToMuseumBotGroupChat = async (text: string) => {
    await axios.get(`https://api.telegram.org/bot${`5645703435:AAEcO4os2D2WP4ourWkZE1A3vVARvO_wIMU`}/sendMessage`, {
        data: {
            chat_id: "-1001503809863",
            text,
        }
    }) 
}