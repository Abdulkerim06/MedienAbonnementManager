package at.htlleonding.tran.service;

import jakarta.enterprise.context.ApplicationScoped;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

@ApplicationScoped
public class MovieApiService {

    OkHttpClient client = new OkHttpClient();

    Request request = new Request.Builder()
            .url("https://api.themoviedb.org/3/authentication")
            .get()
            .addHeader("accept", "application/json")
            .addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDc1MTFmZDQ2ZDA5ZTU5OGVlMWNjMGI1MWIzYzE2YiIsIm5iZiI6MTY5Njg2ODUzOS41NjQsInN1YiI6IjY1MjQyOGJiYWI1ZTM0MDBlMWQ0YzFhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.scmt-UqdGfVHDYw7bWZjzHU2CpJuZyB1trCunA1hJGU")
            .build();

    Response response;

    {
        try {
            response = client.newCall(request).execute();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}