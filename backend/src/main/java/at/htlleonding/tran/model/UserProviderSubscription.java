package at.htlleonding.tran.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "provider_id"}
        )
)
public class UserProviderSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserMovieDB user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "provider_id")
    private Provider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingCycle billingCycle;

    @Column(nullable = false)
    private LocalDate lastBillingDate;

    // optional, aber sehr empfehlenswert
    public LocalDate getNextBillingDate() {
        return switch (billingCycle) {
            case MONTHLY -> lastBillingDate.plusMonths(1);
            case YEARLY -> lastBillingDate.plusYears(1);
        };
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserMovieDB getUser() {
        return user;
    }

    public void setUser(UserMovieDB user) {
        this.user = user;
    }

    public Provider getProvider() {
        return provider;
    }

    public void setProvider(Provider provider) {
        this.provider = provider;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
    }

    public LocalDate getLastBillingDate() {
        return lastBillingDate;
    }

    public void setLastBillingDate(LocalDate lastBillingDate) {
        this.lastBillingDate = lastBillingDate;
    }

}
