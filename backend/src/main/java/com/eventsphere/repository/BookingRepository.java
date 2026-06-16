package com.eventsphere.repository;

import com.eventsphere.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Page<Booking> findByUserEmail(String email, Pageable pageable);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.event.organizer.email = :email")
    BigDecimal getTotalRevenueByOrganizer(@Param("email") String email);

    @Query("SELECT COUNT(t) FROM Booking b JOIN b.tickets t WHERE b.event.organizer.email = :email")
    Long getTotalAttendeesByOrganizer(@Param("email") String email);
}
