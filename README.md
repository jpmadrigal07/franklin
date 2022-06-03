# Franklin Installation Guide

1. Download and install this following files
   - Git (https://git-scm.com/)
   - Node.JS "Recommended For Most Users" or "16.15.1" (https://nodejs.org/en/)
   - MongoDB "msi installer" (https://www.mongodb.com/try/download/community)
   - VSCode (https://code.visualstudio.com/)
2. After all apps are installed, open windows command line as administrator
3. Then change the directory to windows user folder (ex: C:\Users\johndoe) and run this command
   ### `git clone https://github.com/jpmadrigal07/franklin`
4. After cloning, run this command
   ### `npm install --global yarn`
5. After installing yarn, change the directory to the franklin folder inside your user folder (ex: C:\Users\johndoe\franklin)
6. After changing directory, you need to install node_modules, run this command
   ### `yarn`
7. After installing node_modules, you need to install node_modules in client folder, run this command
   ### `yarn install-client`
8. Open VSCode and open the franklin folder in it (C:\Users\johndoe\franklin) and open the start_system.bat file
9. Change the first line of code to your franklin folder directory (C:\Users\johndoe\franklin) make sure the "cd" will not be removed
10. Close VSCode, then go to C:\Users\johndoe\franklin directory folder in your windows, then right-click the start_system.bat file and copy it, then paste it on your Desktop

---

You are finish!

Just double click the start_system.bat file to start the system. Starting the system will also get the latest updated code from the developer. Just close it when you want to close the system.

To login, just use this admin account:

username: admin<br />
password: franklin
