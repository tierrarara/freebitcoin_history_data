from django.db import models

# Identifier user bets for multiple accounts
class Bettor(models.Model):
    username = models.CharField(max_length=127)

# Create your models here.
class Bet(models.Model):
    class Meta:
        unique_together = (('bettor','nounce'))
    
    bettor = models.ForeignKey(Bettor, on_delete=models.PROTECT, default=None)
    executed_at = models.DateTimeField()
    game = models.CharField(max_length=15)
    bet = models.CharField(max_length=4)
    roll = models.IntegerField()
    stake = models.DecimalField(max_digits=12, decimal_places=8)
    multiplicator = models.DecimalField(max_digits=5,decimal_places=2)
    profit = models.DecimalField(max_digits=12, decimal_places=8)
    jackpot = models.BooleanField()
    nounce = models.BigIntegerField()
    balance_before = models.DecimalField(max_digits=12,decimal_places=8,default=0)
    balance_after = models.DecimalField(max_digits=12,decimal_places=8, default=0)
    server_seed =  models.CharField(max_length=255, default=None)
    client_seed =  models.CharField(max_length=255, default=None)
    server_hash =  models.CharField(max_length=255, default=None)

    





