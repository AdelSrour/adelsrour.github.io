var quote_list = document.querySelectorAll(".quote");
var currentQuote;

function newQuote() {
    //Generate Random number between 0 and array length
    var randomQuote = Math.floor(Math.random() * quote_list.length);

    //Check if generated Quote is the current one
    if (randomQuote === currentQuote) {
        if ((randomQuote - 1) >= 0) {
            randomQuote--;
        } else if ((randomQuote + 1) < quote_list.length) {
            randomQuote++;
        }
    }

    //Hide Current Quote
    if (currentQuote != undefined) {
        quote_list[currentQuote].classList.remove("show");
    }
    //Show new Quote
    quote_list[randomQuote].classList.add("show");
    //Update current quote
    currentQuote = randomQuote;
}