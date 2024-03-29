# Changelog

## 3.0.16

- Added README file for installation instruction
- Added new command in package.json for dependency installation

## 3.0.15

- Fix bugs for https://docs.google.com/document/d/1dbR71KzH77lgaYsWv7lggoLMEg1PrQYAaInnLoNEBtQ

## 3.0.14

- Added export excel function on Reports page

## 3.0.13

- Fix all bugs for https://docs.google.com/document/d/1iXnguM2Jq4yOF1yKl96Z4CdD6ahQ_W40H9cgEvJOBo4

## 3.0.12

- Added Dashboard Drop off table
- Added Dashboard DIY table
- Added multiple update function
- Added function to update Amount Due on Dashboard update
- Added minus function for adding item on dashboard
- Fixed diy and do process
- Add function for add notes on top right
- Added sort function for dashboard and orders page
- Added disable edit state on column sort
- Added print page function for orders page

## 3.0.11

- Added Order DIY Table page
- Added Order Drop Off Table page
- Added seed data for zonrox, fabcon, detergent
- Added cancel function for orders table
- Added order view data page
- Added dashboard buttons
- Added customer orders table on customer view
- Added Add DIY and Add Drop off navigate function
- Added deduction on inventory when creating an order
- Added folder value for view order

## 3.0.10

- Added Order DropOff Page
- Added Order DIY Page
- Added Order DropOff View Order Page
- Added Order DIY Page View Order Page
- Added current folder on NavBar
- Change password confirm to base on current loggedin user username
- Added Folder table on Settings for admin and staff account
- Added the ability of all user type to change the current folder of the day
- Added password confirm on change current folder of the day

## 3.0.9

- Fix birthdate does not accepting any value

## 3.0.8

- Fix modal click x persist password for admin
- Fix email and zipcode required add customer

## 3.0.7

- Added lastLoggedIn and lastLoggedOut functionality
- Added lastLoggedIn and lastLoggedOut in staff table
- Added View function on Staff table
- Added change password/staff profile for staff
- Remove view customer header sub text
- Remove package-lock.json files

## 3.0.6

- Fix add customer same firstname and lastname
- Fix customer birtday and birthmonth string
- Fix customer update empty input
- Fix delete item admin password persisting
- Added seed for drop off fee
- Fix add inventory stock accepting float
- Fix table add stock accepting float

## 3.0.5

- Fix main page menu ui problem

## 3.0.4

- Added staff add
- Added staff edit
- Added staff delete

## 3.0.3

- Added cog icon on the header
- Added admin settings page
- Added change admin password function
- Remove Staff page for staff user

## 3.0.2

- Added folder modal pop up when logging in if there is no current folder of the day
- Added header to login page
- Change login form design
- Added add function on folder modal
- Change auth expiry from 1 day to every 12 am
- Change logout to navigate to window.location

## 3.0.1

- Bug fixes for Customer https://drive.google.com/file/d/1ZGnyADEWWACHLVCv6X1JaI8AT8n03elY/view?usp=sharing
- Bug fixes for Inventory https://drive.google.com/file/d/1lTzOj9FC_6xd8nxN2YLU4_lsjiBGHRRC/view?usp=sharing

## 3.0.0

- Added Services page
- Added dry endpoint
- Added wash endpoint
- Added laundry endpoint
- Added add on endpoint
- Added dry endpoint
- Fix add edit on customer page
- Fix add edit on inventory page

## 2.0.1

- Added input label error for Customers
- Added input label error for Inventory
- Added ajv validation
- Added ajv errors
- Added ajv formats

## 2.0.0

- Made Inventory table reusable
- Added asterisk on required fields on Add and Edit Inventory Table
- Added Add Stock on Inventory Table
- Added Delete on Inventory Table
- Added Delete confirm password of Admin function on Inventory Table
- Created constrcutTableActions function file for reusability
- Exclude Edit and Delete function for Staffs on Inventory Table

## 1.0.2

- Made a reusable Table
- Made Customer table reusable
- Required Last Name, First Name, Birth Day, Birth month and Mobile number on Customer Edit and Add
- Change pages margin from 250px to 25px

## 1.0.1

- Added global state set for authenticated user on Navbar

## 1.0.0

- Added Redux packages
- Added Redux boilerplate for global state
- Added Delete confirm modal
- Added Delete admin password modal
- Added condition to show delete button for Admin
- Moved some of Customer table menu from right to left
- Added verify password endpoint for Admin

## 0.0.2

- Added Login UI
- Added auth endpoint
- Added Login functionality
- Added js-cookie package

## 0.0.1

- Added Inventory Table
- Added Inventory Add Function
- Remove console logs

## 0.0.0

- Added Changelog File
