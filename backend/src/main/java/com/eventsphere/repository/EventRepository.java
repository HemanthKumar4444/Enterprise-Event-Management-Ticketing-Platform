package com.eventsphere.repository;

import com.eventsphere.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Page<Event> findByStatus(String status, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND (LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.category) = LOWER(:category))")
    Page<Event> searchEvents(@Param("status") String status, @Param("search") String search, @Param("category") String category, Pageable pageable);
    
    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);
    Page<Event> findByOrganizerEmail(String email, Pageable pageable);
}
