export default class validate {
  constructor(val, field = "") {
    this.val = val;
    this.field = field;
    this.errors = [];
    this.error = "";
    this.isNullable=false;
  }

  required(msg = "This field cannot be blank") {
    if (this.val == "") this.setError(0,msg)
    else
    this.setError(0,"")
    
    this.checkAndSetError();
    return this;
  }



  lenValidator(min = 3, max = 16, msg = `${this.field} length should be minimum ${min} characters and maximum ${max} characters`) {
    if (this.val.length < min || this.val.length > max) this.setError(1,msg)
    else
    this.setError(1,"")
    
    this.checkAndSetError();

    return this;
  }
  isEmail( msg = "Incorrect email format") {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.val))
     this.setError(2,"")
    else this.setError(2,msg)
    this.checkAndSetError();

    return this;
  }

  isString(msg=`Invalid input format for ${this.field}`)
  {
    if(typeof this.val === 'string')
    this.setError(3,"")
    else 
    this.setError(3, msg)

    this.checkAndSetError()
    return this
  }

  isNumber( msg = "Incorrect number format") {
    if (/^[0-9]+$/.test(this.val))
     this.setError(4,"")
    else this.setError(4,msg)
    this.checkAndSetError();

    return this;
  }

  checkAndSetError() {
    let err = this.errors.filter((item) => item != "");

    if(this.isNullable)
    {
      this.error = ""
      return
    }


    this.error = err.length > 0? err[0] : "";

  }


  nullable() {
    if(this.val == "" || !this.val)
    this.isNullable = true

    return this
  }


  isPhone(msg = "Incorrect phone number format. Use format +91124567890"){
    if (/^\+{0,1}[0-9]+$/.test(this.val.replace(" ", "")))
    this.setError(4,"")
   else this.setError(4,msg)
   this.checkAndSetError();
   return this
  }

  setError(key, msg)
  {
    this.errors[key] = msg
  }
}
