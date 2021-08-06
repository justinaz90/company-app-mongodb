const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no "firstName", "lasteName", "department" arg is not given', () => {
    const emp = new Employee({}); 
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    })
  });

  it('should throw an error if "firstName", "lasteName", "department" is not a string', () => {
    const emp = new Employee({ firstName: [], lastName: {}, department: [] });
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if any arg is missing', () => {
    const cases = [
      {firstName: 'John', lastName: 'Doe'},
      {firstName: 'John', department: 'IT'},
      {lastName: 'Doe', department: 'IT'},
      {firstName: 'John'}
    ];
    for(let employee of cases) {
      const emp = new Employee(employee);
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if "firstName", "lasteName", "department" are okay', () => {
    const emp = new Employee({firstName: 'John', lastName: 'Doe', department: 'IT' });
    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });  
  
  after(() => {
    mongoose.models = {};
  });
  
});
