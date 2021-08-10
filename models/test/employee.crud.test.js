const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');


describe('Employee', () => {

  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();
      await mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();

      const testDep = new Department({ name: 'Testing'})
      await testDep.save();

      const testEmpThree = new Employee({ firstName: 'FirstName #3', lastName: 'LastName #3', department: testDep });
      await testEmpThree.save();

    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 3;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employeeFirstName = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(employeeFirstName.firstName).to.be.equal('FirstName #1');

      const employeeLastName = await Employee.findOne({ lastName: 'LastName #3' });
      expect(employeeLastName.lastName).to.be.equal('LastName #3');

      const employeeDepartment = await Employee.findOne({ department: 'Department #2' });
      expect(employeeDepartment.department).to.be.equal('Department #2');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });   
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'newFirstName', lastName: 'newLastName', department: 'newDepartment' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    });    

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'FirstName #1' }, { $set: { firstName: '=FirstName #1=' }});
      const updatedEmployee = await Employee.findOne({ firstName: '=FirstName #1=' });
      expect(updatedEmployee).to.not.be.null;
    });
    
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #1' });
      employee.firstName = '=FirstName #1=';
      await employee.save();
      const updatedEmployee = await Employee.findOne({ firstName: '=FirstName #1=' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });    
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'FirstName #1', lastName: 'LastName #1', department: 'Department #1' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'FirstName #2', lastName: 'LastName #2', department: 'Department #2' });
      await testEmpTwo.save();
    }); 

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'FirstName #1' });
      const removeEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'FirstName #1' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'FirstName #1' });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });    
  });
});