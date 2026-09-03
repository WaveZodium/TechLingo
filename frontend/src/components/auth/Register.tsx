export default function Register() {
    return (
        <div className="register">
            <h2>Register</h2>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />


                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}