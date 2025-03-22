//employee.model.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    bankAccountNo: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    nicNo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Regex for NIC: 9 digits + 'v' OR 12 digits
                return /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid NIC number! Must be 9 digits followed by 'v' or 12 digits`
        }
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;