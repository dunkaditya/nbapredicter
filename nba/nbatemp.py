import pandas
import sys

ELOS = pandas.read_csv('nba/ELO.csv')
dat_teams = pandas.read_csv('nba/teams.csv')
teams = {}
name = dat_teams['NICKNAME']
for i in range(30):
    teams[name[i]] = i

home_team = sys.argv[1]
away_team = sys.argv[2]
ml_home = float(sys.argv[3])
ml_away = float(sys.argv[4])

ELO_home = ELOS['2021'][teams[home_team]]
ELO_away = ELOS['2021'][teams[away_team]]

p_home = 1/(pow(10, -(ELO_home-ELO_away+92)/400)+1)
p_away = 1-p_home

bhome = 0
if ml_home > 0:
    b_home = ml_home/100
else: 
    b_home = -100/ml_home

baway = 0
if ml_away > 0:
    b_away = ml_away/100
else: 
    b_away = -100/ml_away
    
pbankroll_home = p_home + (p_home-1)/b_home
pbankroll_away = p_away + (p_away-1)/b_away

print(round(p_home, 2), round(p_away, 2), round(pbankroll_home, 2), round(pbankroll_away, 2))
