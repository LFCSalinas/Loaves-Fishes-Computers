export const validBrowser = (req, res, next) => {
    const headers = req.headers
    const ba = ["Chrome", "Firefox", "Safari", "Opera", "MSIE", "Trident", "Edge"];
    let b, ua = headers['user-agent'];
    for(let i=0; i < ba.length; i++){
        if(ua.indexOf(ba[i]) > -1){
            b = ba[i];
            break;
        }
    }
    // IF INTERNET EXPLORER IS BEING USED RETURN FALSE OTHERWISE RETURN TRUE
    if (b !== "MSIE" && b !== "Trident") {
        next()
    } else {
        res.status(403).json({ message: 'Unsupported Browser Type' });
        // res.render("unsupported", {title: "Home | Loaves Fishes Computers", user : req.user});
    }
}