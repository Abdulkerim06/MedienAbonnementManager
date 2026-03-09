package at.htlleonding.tran.dto;

import at.htlleonding.tran.model.History;

import java.time.LocalDateTime;

public record HistoryDTO(
        Long id,
        Long tmdbMovieId,
        LocalDateTime watchedAt
) {
    public static HistoryDTO from(History history) {
        return new HistoryDTO(
                history.getId(),
                history.getTmdbMovieId(),
                history.getWatchedAt()
        );
    }
}
