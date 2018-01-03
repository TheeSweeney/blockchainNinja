# LAB 2: Chaincode

## Add a query
> the following optional steps are if you want to work with node modules. 
Node modules are used to highlight stub functions in certain IDE's like WebStorm.

>If you complete these optional steps, develop from inside the `chaincodeDev/` folder. 
Use `npm run startHLFWithDevEnv` to start Hyperledger Fabric with the chaincode written in `chaincodeDev/marbles_chaincode.js`
#####  ___OPTIONAL:___ Go to the chaincodeDev folder inside of this project: 
`cd app/chaincodeDev`
##

##### ___OPTIONAL:___ Install the npm packages:
`npm install`
> We need to install the packages to get feedback from our IDE. 
Functions written in the packages will be highlighted in the chaincode file after this
##
 
##### Open the file with the chaincode: 
`marbles_chaincode.js`
##

##### Find and read trough the following function: 
`queryMarblesByOwner()`
 > In this function the chaincode is queried for marbles. 
 Only the results with a specified owner will be returned.
##

##### Make a query function called queryMarblesByColor
 > Hint: if you get stuck compare your code to the `queryMarblesByOwner()` function.
##

##### Call the queryMarblesByColor() function from the SDK
> In our previous lab, we worked with the SDK. Here we learned how to call chaincode functions.
Try to add some marbles by doing some `invoke` functions from the sdk, and try to retrieve them by color using this function.

>Hint: if you get stuck, do the first lab (in this directory). If you already did that, check out app.ts and search for `query` or `invoke`. 
##

## Add an Invoke
 
##### Open the file with the chaincode: 
`marbles_chaincode.js`
##

##### Find and read trough the following function: 
`transferMarble()`
 > In this function the chaincode is changing the owner for a certain marble. 
##

##### Make an invoke function called paintMarble
> this function should change the color of a certain marble to a color of your choise.

 > Hint: if you get stuck compare your code to the `transferMarble()` function.

##### Call the paintMarble() function from the SDK
> In our previous lab, we worked with the SDK. Here we learned how to call chaincode functions.
Try to change some colors of marbles

>Hint: if you get stuck, do the first lab (in this directory). If you already did that, check out app.ts and search for `query` or `invoke`. 
##

## Bonus exercise
##### Make sure that the chaincode throws an error if you try to paint the marble in the same color that it already has
###### example: If you paint a green marble green throw an error

> call this function by using the sdk. try to get the error printed out in `Kitematic`.

