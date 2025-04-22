async function fetchDog(){
    const response = await fetch('http://localhost:5000/api/dogs');
    const responseData = await response.json();
}

async function fetchCat(){
    const response = await fetch('http://localhost:5000/api/cats');
    const responseData = await response.json();
}


// fetchCat()
// fetchDog()