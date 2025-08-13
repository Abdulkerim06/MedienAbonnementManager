package at.htlleonding.tran.rest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class TmdbApiClient {

    private static final String BASE_URL = "https://api.themoviedb.org/3/movie";
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String getWatchProviders(String bearerToken, String movieId) throws IOException, InterruptedException {
        String url = BASE_URL + "/" + movieId + "/watch/providers";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", bearerToken)
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
}
