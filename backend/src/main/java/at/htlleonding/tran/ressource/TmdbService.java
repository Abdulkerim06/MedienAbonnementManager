package at.htlleonding.tran.ressource;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@ApplicationScoped
public class TmdbService {

    @ConfigProperty(name = "tmdb.api.v4.token")
    String tmdbV4Token;

    private OkHttpClient client = new OkHttpClient();

    public String getMovieProviders(int movieId) throws Exception {
        Request request = new Request.Builder()
                .url("https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers")
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", "Bearer " + tmdbV4Token)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("API call failed: " + response);
            }
            return response.body().string();
        }
    }

    public String getMovieByID(int movieId) throws Exception {
        Request request = new Request.Builder()
                .url("https://api.themoviedb.org/3/movie/" + movieId)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", "Bearer " + tmdbV4Token)
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("API call failed: " + response);
            }
            return response.body().string();
        }
    }

    public String getMovieByName(String movieName) throws Exception {
        Request request = new Request.Builder()
                .url(" https://api.themoviedb.org/3/search/movie?query=" + movieName)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", "Bearer " + tmdbV4Token)
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("API call failed: " + response);
            }
            return response.body().string();
        }
    }
}
