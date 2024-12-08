class SmartLogin {

    constructor() {
        this.name_regex = /^[\w-]{3,24}$/i;
        this.email_regex = /^[a-z0-9._-]{1,255}(@)[a-z0-9_-]{1,255}(((.)[a-z0-9]{1,50}){1,5})?$/i;
        this.password_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    }

    validate_check(status, element) {
        if (status == false) {
            element.classList.add("is-invalid");
            element.classList.remove("is-valid");
        } else {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
        }

        return status;
    }

    create_account(form) {
        form.preventDefault();
        this.name = document.getElementById("username");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.repassword = document.getElementById("repassword");
        let database = JSON.parse(localStorage.getItem("clients")) ? JSON.parse(localStorage.getItem("clients")) : [];
        document.getElementById("email_valid").innerHTML = "Email must be in a valid format";

        let name_check = this.validate_check(this.name_regex.test(this.name.value), this.name);
        let email_check = this.validate_check(this.email_regex.test(this.email.value), this.email);
        let password_check = this.validate_check(this.password_regex.test(this.password.value), this.password);
        let repassword_check = this.validate_check((this.password.value === this.repassword.value && password_check == true), this.repassword);

        database.forEach(element => {
            if (element.email.toLowerCase() == this.email.value.toLowerCase()) {
                email_check = false;
                this.email.classList.add("is-invalid");
                this.email.classList.remove("is-valid");
                document.getElementById("email_valid").innerHTML = "Email is already registered. Please choose another Email!";
            }
        });

        if (name_check === true && email_check === true && password_check === true && repassword_check === true) {
            let accountData = {
                name: this.name.value,
                email: this.email.value,
                password: this.password.value,
            }
            database.push(accountData);
            localStorage.setItem("clients", JSON.stringify(database));

            document.getElementById("registered_msg").style.display = "block";
            document.getElementById("register_btn").disabled = true;

            setTimeout(() => { window.location = "login.html"; }, 2000);

            return true;
        }

        return false;
    }


    login(form) {
        form.preventDefault();

        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        let database = JSON.parse(localStorage.getItem("clients")) ? JSON.parse(localStorage.getItem("clients")) : [];

        this.validate_check(false, this.email);

        database.forEach(element => {
            if (element.email.toLowerCase() == this.email.value.toLowerCase()) {
                this.validate_check(true, this.email);
                if (element.password === this.password.value) {
                    localStorage.setItem("is_logged", element.name);
                    document.getElementById("login_msg").style.display = "block";
                    document.getElementById("login_btn").disabled = true;
                    setTimeout(() => { window.location = "index.html"; }, 2000);
                    this.validate_check(true, this.password);
                } else {
                    this.validate_check(false, this.password);
                }
            }
        });

        return false;
    }

    is_logged() {
        let username = localStorage.getItem("is_logged");
        if ((this.name_regex.test(username) === true) && (username !== null)) {
            document.getElementById("client_welcome").innerHTML = username;
        } else {
            window.location = "login.html";
        }
    }

    logout() {
        localStorage.setItem("is_logged", "");
        window.location = "login.html";
    }

}
let smartLogin = new SmartLogin();

