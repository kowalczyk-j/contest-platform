from locust import HttpUser, TaskSet, task, between


class UserBehavior(TaskSet):
    loginw = "admin"
    passw = "admin"

    def on_start(self):
        self.token = self.login()

    def login(self):
        response = self.client.post("/api/login/", json={
            "username": self.loginw,
            "password": self.passw
        })
        return response.json()["token"]

    @task
    def login_taks(self):
        self.client.post("/api/login/", json={
            "username": self.loginw,
            "password": self.passw
        })

    @task
    def max_ratings(self):
        self.client.get(
            "/api/contests/1/max_rating_sum/",
            headers={"Authorization": f"Token {self.token}"}
            )

    @task
    def certificate(self):
        endpoint = "/api/contests/certificate/?contest=title&participant"
        endpoint += "=dsffds&achievement=fds&signature=dfs&signatory=fds"
        self.client.get(
            endpoint,
            headers={"Authorization": f"Token {self.token}"}
        )

    @task
    def to_evaluate(self):
        self.client.get(
            "/api/grades/to_evaluate/?contestId=1",
            headers={"Authorization": f"Token {self.token}"}
        )

    @task
    def submissions(self):
        self.client.get(
            "/api/contests/1/get_submissions_by_day/",
            headers={"Authorization": f"Token {self.token}"}
        )

    @task
    def entry_amount(self):
        self.client.get(
            "/api/contests/1/get_entry_amount/",
            headers={"Authorization": f"Token {self.token}"}
        )

    @task
    def current_user(self):
        self.client.get(
            "/api/users/current_user/",
            headers={"Authorization": f"Token {self.token}"}
        )

    @task
    def favourite(self):
        self.client.patch(
            "/api/entries/1/",
            headers={"Authorization": f"Token {self.token}"},
            json={"favourite": "true", "canceled": "false"}
        )


class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)
