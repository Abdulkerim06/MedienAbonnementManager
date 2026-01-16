package at.htlleonding.tran.dto;

import java.time.LocalDate;

public record TrendingMovieDTO(Long id, String title, String poster, String overview, double popularity, LocalDate releaseDate, double voteAverage, double voteCount) {

}
