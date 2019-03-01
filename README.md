This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Then, the global-input-app extension dependency is added:

```
npm i @bit/globalinput.web.global-input-connect
```

For encrypting and decrypting form query parameter for bookmarking, actually you can use bas64 encoding and decoding:

```
npm i global-input-message
```

Then some generic UI dependencies are added. You can replace them with your preferred JavaScript libraries:

```
npm i @bit/globalinput.web.clipboard-copy-button

npm i @bit/globalinput.web.input-with-label

npm i @bit/globalinput.web.text-button

npm i @bit/globalinput.web.selectable-input
```

Finally, the first implemented the logic for building a form and then added the logic for connecting to the Global Input App contains all the logic.

You can run the application using ```npm run start``` or ```yarn start``` command:<br>
```
npm run start
```
It will display a form that you can use it to communicate with Global Input App, you can modify the form by adding new form fields or delete the selected fields. Then you can press "Finish" when you are happy with the form. This will display a QR code. Scan the QR code displayed with your [Global Input App](https://globalinput.co.uk/) on your mobile to transfer form data between your mobile and the computer using the end-to-end encryption.
