package at.htlleonding.tran.ressource;

import at.htlleonding.tran.dto.ProviderApi;
import at.htlleonding.tran.dto.ProviderInfoDTO;
import at.htlleonding.tran.dto.TrendingMovieDTO;
import at.htlleonding.tran.model.CountryPriority;
import at.htlleonding.tran.model.Provider;
import at.htlleonding.tran.repository.ProviderRepository;
import at.htlleonding.tran.repository.UserMovieDBRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;


import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.StreamSupport;


@ApplicationScoped
public class TmdbService {

    @Inject
    UserMovieDBRepository userMovieDBRepository;

    @ConfigProperty(name = "tmdb.api.v4.token")
    String tmdbV4Token;

    @Inject
    ProviderRepository providerRepository;

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

//
//    public List<ProviderInfoDTO> getFilteredProvidersAndCheckedForProvidersOfUser(int movieId, String countryCode, Long userId) throws Exception {
//        // TMDB API URL
//        String url = "https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers";
//
//        Request request = new Request.Builder()
//                .url(url)
//                .get()
//                .addHeader("accept", "application/json")
//                .addHeader("Authorization", "Bearer " + tmdbV4Token)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new RuntimeException("API call failed: " + response);
//            }
//
//            // JSON parsen
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(response.body().string());
//
//            JsonNode flatrate = root.path("results").path(countryCode).path("flatrate");
//
//            // User-Provider holen
//            Set<String> userProviders = userMovieDBRepository.findProvidersByUser(userId);
//
//            List<ProviderInfoDTO> providers = new ArrayList<>();
//            if (flatrate.isArray()) {
//                for (JsonNode provider : flatrate) {
//                    String name = provider.path("provider_name").asText();
//                    String logo = "https://image.tmdb.org/t/p/w92" + provider.path("logo_path").asText();
//
//                    boolean owned = userProviders.contains(name); // Abgleich
//                    if (owned) {
//                        providers.add(new ProviderInfoDTO(provider.path("provider_name").asText(),
//                                logo,true));
//                    }
//                }
//            }
//
//            return providers;
//        }
//    }

    public List<TrendingMovieDTO> getTrendingMovies(String timewindow){
        String url = "https://api.themoviedb.org/3/trending/movie/" + timewindow;

        List<TrendingMovieDTO> trendingMoviesDto = new ArrayList<>();

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
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body().string());

            JsonNode results = root.path("results");

            if (results.isArray()) {
                for (JsonNode movie : results) {
                    String poster = "https://image.tmdb.org/t/p/w92" + movie.path("poster_path").asText(null);

                    TrendingMovieDTO dto = new TrendingMovieDTO(
                            movie.path("id").asLong(),
                            movie.path("title").asText(),
                            poster,
                            movie.path("overview").asText(),
                            movie.path("popularity").asDouble(),
                            LocalDate.parse(movie.path("release_date").asText()),
                            movie.path("vote_average").asDouble(),
                            movie.path("vote_count").asInt()
                    );
                    trendingMoviesDto.add(dto);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return trendingMoviesDto;
    }


    public List<ProviderApi> getProviders(){
        String url = "https://api.themoviedb.org/3/watch/providers/movie";

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
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body().string());


            List<ProviderApi> apiProviders =
                    StreamSupport.stream(root.path("results").spliterator(), false)
                            .map(node -> mapper.convertValue(node, ProviderApi.class))
                            .toList();

            List<ProviderApi> apiProvidersResponse = new ArrayList<>();
            apiProviders.forEach(api -> {

                String logo = ("https://image.tmdb.org/t/p/w92" + api.logo_path());

                ProviderApi providerApi = new ProviderApi(
                  api.id(),
                  api.provider_name(),
                  logo,
                        api.display_priorities()

                );
                apiProvidersResponse.add(providerApi);

            });
            return apiProvidersResponse;


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
