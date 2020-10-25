exports.handler = async (event, context) => {
    console.log("triggered")
    return { statusCode: 200, body: JSON.stringify({ "message": "hello" }) };
}