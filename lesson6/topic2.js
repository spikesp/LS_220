var counterId;
function startCounting() {
  var count = 0;

  counterId = setInterval(function() {
    count++;
    console.log(count);
  }, 1000);
}

startCounting();

function stopCounting() {
  clearInterval(counterId);
}
