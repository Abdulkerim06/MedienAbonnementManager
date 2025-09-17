package at.htlleonding.tran.ressource;

import at.htlleonding.tran.dto.ProviderInfoDTO;
import at.htlleonding.tran.model.ProviderInfo;
import at.htlleonding.tran.model.UserMovieDb;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class TmdbService {

    @Inject
    UserMovieDBRepository userMovieDBRepository;

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




    public List<ProviderInfoDTO> getFilteredProviders(Long movieId, String countryCode) throws Exception {
        // TMDB API URL
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers";

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", "Bearer " + tmdbV4Token)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("API call failed: " + response);
            }

            // JSON parsen
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body().string());

            JsonNode flatrate = root.path("results").path(countryCode).path("flatrate");

            List<ProviderInfoDTO> providers = new ArrayList<>();
            if (flatrate.isArray()) {
                for (JsonNode provider : flatrate) {
                    providers.add(new ProviderInfoDTO(
                            provider.path("provider_name").asText(),
                            "https://image.tmdb.org/t/p/w92" + provider.path("logo_path").asText()
                    ));
                }
            }
            return providers;
        }
    }


    public List<ProviderInfoDTO> getFilteredProvidersAndCheckedForProvidersOfUser(int movieId, String countryCode, Long userId) throws Exception {
        // TMDB API URL
        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers";

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("accept", "application/json")
                .addHeader("Authorization", "Bearer " + tmdbV4Token)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new RuntimeException("API call failed: " + response);
            }

            // JSON parsen
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body().string());

            JsonNode flatrate = root.path("results").path(countryCode).path("flatrate");

            // User-Provider holen
            Set<String> userProviders = userMovieDBRepository.findProvidersByUser(userId);

            List<ProviderInfoDTO> providers = new ArrayList<>();
            if (flatrate.isArray()) {
                for (JsonNode provider : flatrate) {
                    String name = provider.path("provider_name").asText();
                    String logo = "https://image.tmdb.org/t/p/w92" + provider.path("logo_path").asText();

                    boolean owned = userProviders.contains(name); // Abgleich
                    if (owned) {
                        providers.add(new ProviderInfoDTO());
                    }
                }
            }

            return providers;
        }
    }



}
