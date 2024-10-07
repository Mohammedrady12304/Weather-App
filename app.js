//the  Global Var
const mainURLZip = "https://api.openweathermap.org/data/2.5/weather?zip=";
const mainURLCity = "https://api.openweathermap.org/data/2.5/weather?q=";

// The URL of server 
const theHost = "http://localhost:8050";

//personal API Key
const apiKey = '&units=metric&appid=b931303e7e66344d244c80fb26104956';

// Create a new date instance (dynamically) with JS
let dat = new Date();
let newDate = dat.getDate()+'/'+dat.getMonth()+1+'/'+ dat.getFullYear();

//elements which will be used
const inputZip = document.getElementById('zip');
const inputCity = document.getElementById('nameOfCity');
const btn = document.getElementById('generate');
const inputFeelings= document.getElementById("feelings");


//event listener on generate button
document.getElementById('generate').addEventListener('click', function extractInfo() 
{
    const zipCode = inputZip.value;
    const nameOfCity = inputCity.value;
   //communicate with the API
   (async function()
      {
        if(zipCode!= "")
        {
          const result = await fetch(mainURLZip + zipCode + apiKey);
          try
          {
            const incomeData = await result.json();
            console.log(incomeData);
            const requiredData= getRequiredData(incomeData);
            return requiredData;
          }
          catch (error) 
          {
            console.log('Error: ',error);
          }
        
        }
        else if(nameOfCity!= "")
        {
          const result= await fetch ( mainURLCity + nameOfCity + apiKey);
          try
          {
            const incomeData = await result.json();
            const requiredData= getRequiredData(incomeData);
            return requiredData;
          }
          catch (error) 
          {
            console.log('Error: ',error);
          }
        
        }
      }())
   .then((requiredData)=>{
       //post the data to the server
       (async function (){
          const res = await fetch(theHost+ '/putData', {
              method : 'POST',
              credentials : 'same-origin',
              headers : {
                  'Content-Type': 'application/json',
              },
              body : JSON.stringify(requiredData),
          });
          try{
              const finalData = await res.json();
              console.log(finalData);
              return(finalData);
          }
          catch(error){
              console.log("error", error);
          }
      }
       )()})
   //show the results on the page elements
   .then(()=>(async function(){
    const req = await fetch(theHost+ '/currentData');
    try{
        const savedData = await req.json();
        console.log(savedData);
        //show results on the elements
        document.getElementById("date").innerHTML = savedData.newDate;
        document.getElementById("city").innerHTML = savedData.city;
        document.getElementById("temp").innerHTML = savedData.temp + '&degC';
        document.getElementById("min").innerHTML = 'min: '+savedData.temp_min + '&degC';
        document.getElementById("max").innerHTML = 'max: '+savedData.temp_max + '&degC';
        document.getElementById("description").innerHTML = savedData.description;
        document.getElementById("content").innerHTML = savedData.feelings;
        document.getElementById('result').style.visibility = 'visible';
    }
    catch(error)
    {
        console.log("error", error);
    }
   })());
});



// Make the button disabled at first
btn.disabled= true;

// Making the button disabled when both the zip and city inputs are empty
inputZip.addEventListener("input", function(){
  btn.disabled = (this.value === ''&&inputCity.value==='');
})

inputCity.addEventListener("input", function(){
  btn.disabled = (this.value === ''&&inputZip.value==='');
})

// Making the city name input disabled when the zip input isn't empty
inputZip.addEventListener("input", function(){
  inputCity.disabled = !(this.value === '');
})
// required information from the api returned data
function getRequiredData(incomeData)
{
  const temp = incomeData.main.temp;
  const description = incomeData.weather[0].description;
  const temp_min = incomeData.main.temp_min;
  const temp_max = incomeData.main.temp_max;
  const city = incomeData.name;
  const feelings = inputFeelings.value;
  const requiredData = { newDate, temp, description, temp_min, temp_max, city, feelings };
  return requiredData;
}
// Making the zip input disabled when the city name input isn't empty
inputCity.addEventListener("input", function(){
  inputZip.disabled = !(this.value === '');
})

// Function to clear all the inputs when the page is reloaded
function clearInput() 
{
  const inputs=document.getElementsByTagName("input");
  for (let ip in inputs)
  {
    ip.value='';
  }
}

// Function to clear the results when clicking the x button
function clearResult()
{
  document.getElementById('result').style.visibility = 'hidden';
}
