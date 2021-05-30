# Job Portal API

Job portal API provides a API interface to the basic functionalities of a Job Portal. The API uses MongoDB database and is built in NodejS. It uses JWT for the verification.

## API End Points

Guide to API endpoints can be accessed via "".

API URL: `http://prakharjain.org/jobportalapi/`
Header: `authToken`

## API Test Data Dump

API dump is in the folder "dump.zip". Unzip the folder and use the belown command to restore the data dump in the system. 

```bash
mongorestore dump
```

## Test Logins

```python

# For 'Recruiter'
{

    "email": "abc@abc.com",
    "password": "123456"

}

# For 'Candidate'
{

    "email": "tarun@maheshwari.com",
    "password": "123456"

}
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

