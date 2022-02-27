export enum RegexEnum {
    name = '^[a-zA-Z ]*$',
    phone = '^[0-9]{10}$',
    amount = '^([0-9]+(\.[0-9]+)?)',
    numeric = '^[0-9]*\.?[0-9]+$',
    alpha_spaces = '^[a-zA-Z ]+$',
    alpha_numeric = '^[A-Z0-9]+$',
    email = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
    mobile = '^[0-9]{8,16}$',
    url = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
    zipcode = '^[0-9]{5}(?:-[0-9]{4})?$',
    passwordValidation = '^(?=.{8,15})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^!&*+=~`*]).*$',
}