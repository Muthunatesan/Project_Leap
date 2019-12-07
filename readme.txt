Application access instructions:

Clone/download repository from GitHub.
Open terminal in the project folder.
Make sure node is installed.
Run npm install ganache-cli
Run cd node_modules/.bin
Run ganache-cli
Open https://remix.ethereum.org
Open all *.sol files from contracts folder in the repo in the file explorer tab of the website.
In the Compile tab, compile Splitwise.sol.
Go to Deploy tab and change the environment to Web3 Provider.
If ganache is running, a popup with localhost:8545 as the endpoint appears. Click OK.
Copy the contract address from below in Deployed Contracts pane and paste it in the contactAddress variable in config.js in project root.
Open index.html from project root or point your browser to https://splitwiseblockchain.azurewebsites.net/ or http://testsplit.eastus.cloudapp.azure.com/.

The application should open with the list of addresses displayed in the ganache terminal. You can play around with the application. 

Accessing the VM:

Open VM.rdp file in VM folder using Microsoft Remote Desktop. Select the account 'shyam'. Enter the password mentioned in the submission of Shyam Senthil Nathan. You will have access to the VM. The application will be running in a browser in the VM.

Kindly let us know once grading is done so that we can shut down the VM and save our credits/money.

CI/CD:

Any changes to the master branch in the GitHub repo will trigger redeployment of the application at https://splitwiseblockchain.azurewebsites.net/. It usually takes around 5 minutes for the deployment to be complete from the time a change is observed.

Note: If running outside VM, ganache must be started and the contractAddress must be updated by following the steps mentioned above to access the application. This is a limitation of using ganache as the blockchain. Deploying on MainNet does not have this limitation, but requires actual ether to be mined. We have used ganache to overcome this limitation.
